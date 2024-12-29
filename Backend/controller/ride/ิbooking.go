package controller

import (
	"backend/config"
	"backend/entity/ride"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateBooking creates a new booking
func CreateBooking(c *gin.Context) {
	var booking entity.Booking

	// Bind the request body to the booking struct
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// Connect to database
	db := config.DB()

	// ตรวจสอบว่า RideID มีอยู่จริงในฐานข้อมูลก่อนบันทึกการจอง
	var ride entity.Ride
	if err := db.First(&ride, booking.RideID).Error; err != nil {
    c.JSON(http.StatusNotFound, gin.H{"error": "Ride not found"})
    return
}

	// Create a new booking object
	newBooking := entity.Booking{
		TicketID: booking.TicketID,
		Date:     booking.Date,
		Time:     booking.Time,
		RideID:   booking.RideID,
	}

	// Save the booking in the database
	if err := db.Create(&newBooking).Error; err != nil {
		log.Println("Database error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create booking"})
		return
	}

	// Return success response
	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking created successfully",
		"data":    newBooking,
	})
}

// GetBookingWithRide retrieves a booking with ride details
func GetBookingWithRide(c *gin.Context) {
	ID := c.Param("id")
	var booking entity.Booking

	// Connect to database
	db := config.DB()

	// Retrieve booking with ride details
	if err := db.Preload("Ride").First(&booking, ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	// Return booking with ride details
	c.JSON(http.StatusOK, booking)
}

// ListBookings retrieves all bookings
func ListBookings(c *gin.Context) {
	var bookings []entity.Booking

	// Connect to database
	db := config.DB()

	// Retrieve all bookings
	if err := db.Find(&bookings).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No bookings found"})
		return
	}

	// Return all bookings
	c.JSON(http.StatusOK, bookings)
}

// DeleteBooking deletes a booking by ID
func DeleteBooking(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()

	// Delete booking by ID
	if tx := db.Delete(&entity.Booking{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Booking ID not found"})
		return
	}

	// Return success message
	c.JSON(http.StatusOK, gin.H{"message": "Booking deleted successfully"})
}

// UpdateBooking updates a booking by ID
func UpdateBooking(c *gin.Context) {
	var booking entity.Booking
	id := c.Param("id")

	db := config.DB()

	// Find the booking by ID
	if err := db.First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking ID not found"})
		return
	}

	// Bind the request body to the booking struct
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input", "details": err.Error()})
		return
	}

	// Save the updated booking
	if err := db.Save(&booking).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to update booking"})
		return
	}

	// Return success message
	c.JSON(http.StatusOK, gin.H{"message": "Booking updated successfully"})
}

// CountBookings counts total bookings
func CountBookings(c *gin.Context) {
	var count int64

	// Connect to database
	db := config.DB()

	// Count total bookings
	if err := db.Model(&entity.Booking{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to count bookings"})
		return
	}

	// Return the count of bookings
	c.JSON(http.StatusOK, gin.H{"count": count})
}
