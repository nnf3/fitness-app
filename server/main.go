package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("APP_PORT")
	log.Println("✅ アプリをポート", port, "で起動します")

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Hello, World!"})
	})

	r.Run(":" + port)
}
