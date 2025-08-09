package main

import (
	"app/auth"
	"app/db"
	"app/graph"
	"app/middleware"
	"context"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/rs/cors"
	"github.com/vektah/gqlparser/v2/ast"
)

func main() {
	port := os.Getenv("APP_PORT")
	log.Println("✅ アプリをポート", port, "で起動します")

	db.ConnectDB()

	// Firebase Authの初期化
	firebaseAuth, err := auth.NewFirebaseAuth(context.Background())
	if err != nil {
		log.Fatalf("Failed to initialize Firebase Auth: %v", err)
	}

	// 認証ミドルウェアの初期化
	authMiddleware := middleware.NewAuthMiddleware(firebaseAuth)

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		DB:             db.DB,
		FirebaseAuth:   firebaseAuth,
		AuthMiddleware: authMiddleware,
		DataLoaders:    graph.NewDataLoaders(db.DB),
	}}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	// CORS設定
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	// GraphQL playground
	http.Handle("/", c.Handler(playground.Handler("GraphQL playground", "/query")))
	// GraphQL endpoint with auth middleware and data loaders
	withDataloaderHandler := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := graph.WithDataLoaders(r.Context(), db.DB)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
	http.Handle("/query", c.Handler(authMiddleware.AuthMiddleware(withDataloaderHandler(srv))))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
