package main

import (
	"app/db"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("APP_PORT")
	log.Println("✅ アプリをポート", port, "で起動します")

	db.ConnectDB()

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})

	r.Run(":" + port)
}
