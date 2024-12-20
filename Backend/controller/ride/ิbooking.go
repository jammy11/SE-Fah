package controller

import (
	"backend/config"
	"backend/entity/ride"
	"net/http"
	"github.com/gin-gonic/gin"
	//"time"
)

// CreateBooking สร้างการจองเครื่องเล่นใหม่
func CreateBooking(c *gin.Context) {
	var booking entity.Booking

	// bind ข้อมูลจาก JSON เข้าตัวแปร booking
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้างการจองเครื่องเล่นใหม่
	newBooking := entity.Booking{
		BookingDate: booking.BookingDate,
		TicketID:    booking.TicketID,
		Time:        booking.Time,
		RideID:      booking.RideID,
		RideScheduleID: booking.RideScheduleID,
	}

	// บันทึกการจอง
	if err := db.Create(&newBooking).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": newBooking})
}

// GET /booking/:id
func GetBooking(c *gin.Context) {
	ID := c.Param("id")
	var booking entity.Booking

	db := config.DB()
	results := db.Preload("Ride").Preload("RideSchedule").First(&booking, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if booking.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, booking)
}

// GET /bookings
func ListBookings(c *gin.Context) {
	var bookings []entity.Booking

	db := config.DB()
	results := db.Preload("Ride").Preload("RideSchedule").Find(&bookings)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, bookings)
}

// DELETE /bookings/:id
func DeleteBooking(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM bookings WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /bookings/:id
func UpdateBooking(c *gin.Context) {
	var booking entity.Booking

	bookingID := c.Param("id")

	db := config.DB()
	result := db.First(&booking, bookingID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&booking)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// CountBookings นับจำนวนการจองทั้งหมด
func CountBookings(c *gin.Context) {
	var count int64
	db := config.DB()
	if err := db.Model(&entity.Booking{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
