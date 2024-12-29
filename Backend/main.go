package main

import (
	"backend/config"

	"backend/controller/ride"

	"github.com/gin-gonic/gin"
)

const PORT = "3036"

func main() {
	// เปิดการเชื่อมต่อฐานข้อมูล
	config.ConnectionDB()

	// สร้างฐานข้อมูล
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	// r.POST("/login", controller.SignIn)

	router := r.Group("")
	{
		// Routes สำหรับ Ride
		router.GET("/rides", controller.ListRides)
		router.GET("/ride/:id", controller.GetRide)
		router.POST("/rides", controller.CreateRide)
		router.PATCH("/rides", controller.UpdateRide)
		router.DELETE("/rides/:id", controller.DeleteRide)

		// กำหนดเส้นทางสำหรับการสร้างการจอง
		router.POST("/bookings", controller.CreateBooking)
		// กำหนดเส้นทางสำหรับการดึงข้อมูลการจอง
		router.GET("/bookings/:id", controller.GetBookingWithRide)
		// กำหนดเส้นทางสำหรับการดึงข้อมูลการจองทั้งหมด
		router.GET("/bookings", controller.ListBookings)
		// กำหนดเส้นทางสำหรับการลบการจอง
		router.DELETE("/bookings/:id", controller.DeleteBooking)
		// กำหนดเส้นทางสำหรับการอัพเดตการจอง
		router.PUT("/bookings/:id", controller.UpdateBooking)
		// กำหนดเส้นทางสำหรับการนับการจอง
		router.GET("/bookings/count", controller.CountBookings)




	// 	// Count จำนวน Ride
		router.GET("/rides/count", controller.CountRides)
	
	 }

	// รันเซิร์ฟเวอร์
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
