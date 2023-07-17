package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/tealeg/xlsx"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func connectMongodb() *mongo.Client {
	var house string = "mongodb://44.211.196.161:27017"
	client, err := mongo.NewClient(
		options.Client().ApplyURI(house))

	if err != nil {
		return nil
	}

	ctx, cancel := context.WithTimeout(
		context.Background(), 10*time.Second)

	defer cancel()

	err = client.Connect(ctx)

	if err != nil {
		return nil
	}

	return client
}

type Air struct {
	PM1       int       `json:"pm1"`
	PM2_5     int       `json:"pm2_5"`
	PM10      int       `json:"pm10"`
	CreatedAt time.Time `json:"created_at"`
}

func generateExcelFile(result []Air) error {
	file := xlsx.NewFile()
	// สร้างชีทใหม่
	sheet, err := file.AddSheet("Sheet1")
	if err != nil {
		return err
	}

	// เพิ่มหัวข้อคอลัมน์
	column := sheet.AddRow()
	cell := column.AddCell()
	cell.Value = "DATE"
	cell = column.AddCell()
	cell.Value = "PM1"
	cell = column.AddCell()
	cell.Value = "PM2_5"
	cell = column.AddCell()
	cell.Value = "PM10"

	// เพิ่มข้อมูลจาก result
	for _, value := range result {
		column = sheet.AddRow()
		cell = column.AddCell()
		timeString := value.CreatedAt.Format("2006-01-02 15:04:05")
		cell.Value = timeString
		cell = column.AddCell()
		cell.Value = fmt.Sprintf("%d", rune(value.PM1))
		cell = column.AddCell()
		cell.Value = fmt.Sprintf("%d", rune(value.PM2_5))
		cell = column.AddCell()
		cell.Value = fmt.Sprintf("%d", rune(value.PM10))
	}

	// บันทึกไฟล์ Excel
	err = file.Save("swu_pm.xlsx")
	if err != nil {
		return err
	}

	return nil
}

func main() {

	client := connectMongodb()

	if client == nil {
		fmt.Println("Failed to connect to MongoDB")
		return
	}

	database := client.Database("swu")
	pm_collection := database.Collection("pm")
	file_name := database.Collection("filename")

	router := gin.Default()

	router.Use(cors.Default())

	router.POST("/air-sensor", func(c *gin.Context) {

		var air Air

		if err := c.ShouldBindJSON(&air); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		location, err := time.LoadLocation("Asia/Bangkok")
		if err != nil {
			fmt.Println("ไม่สามารถโหลดตำแหน่งทางภูมิศาสตร์ได้:", err)
			return
		}

		air.CreatedAt = time.Now().In(location)
		pm_collection.InsertOne(context.Background(), air)
		c.JSON(http.StatusOK, gin.H{"message": "Data received successfully"})
	})

	router.GET("/air-sensor-all", func(c *gin.Context) {

		var result []Air
		filter := bson.D{}
		options := options.Find().SetSort(bson.D{{"createdat", -1}}).SetLimit(21)

		cursor, _ := pm_collection.Find(context.Background(), filter, options)
		cursor.All(context.Background(), &result)

		c.JSON(http.StatusOK, result)

	})

	router.GET("/download", func(c *gin.Context) {
		var result []Air
		filter := bson.D{}

		cursor, _ := pm_collection.Find(context.Background(), filter)

		cursor.All(context.Background(), &result)

		// สร้างไฟล์ Excel
		err := generateExcelFile(result)

		if err != nil {
			c.String(http.StatusInternalServerError, "เกิดข้อผิดพลาดในการสร้างไฟล์ Excel")
			return
		}

		// อ่านไฟล์ Excel
		file, err := os.Open("swu_pm.xlsx")
		if err != nil {
			c.String(http.StatusInternalServerError, "เกิดข้อผิดพลาดในการเปิดไฟล์ Excel")
			return
		}
		defer file.Close()

		c.Header("Content-Disposition", "attachment; filename=pm.xlsx")
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.File("swu_pm.xlsx")
	})

	type File struct {
		File string `json:"file"`
	}

	router.POST("/upload-point-cloud", func(c *gin.Context) {
		var result File
		file, _ := c.FormFile("file")
		result.File = file.Filename
		c.SaveUploadedFile(file, "file/"+file.Filename)
		_, err := file_name.InsertOne(context.Background(), result)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	})

	router.GET("/file-all", func(c *gin.Context) {

		var result []File
		filter := bson.D{}

		cursor, _ := file_name.Find(context.Background(), filter)

		cursor.All(context.Background(), &result)

		c.JSON(http.StatusOK, result)
	})

	router.GET("/image/:filename", func(c *gin.Context) {
		filename := c.Param("filename")

		filePath := filepath.Join("./file", filename)
		_, err := os.Stat(filePath)

		if os.IsNotExist(err) {
			filePath = filepath.Join("./file", "bmw,glb")
			os.Stat(filePath)
			c.File(filePath)
			return
		}

		c.File(filePath)
	})

	router.Run(":7700")
}
