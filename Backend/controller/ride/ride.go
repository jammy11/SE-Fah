package controller

import (
	"backend/config"

	"backend/entity/ride"

	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateRide สร้างเครื่องเล่นใหม่
func CreateRide(c *gin.Context) {
	var ride entity.Ride

	// bind ข้อมูลจาก JSON เข้าตัวแปร ride
	if err := c.ShouldBindJSON(&ride); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้างเครื่องเล่นใหม่
	r := entity.Ride{
		RideName:  ride.RideName,
		Description: ride.Description,
		Capacity: ride.Capacity,
		Image : ride.Image ,
		
	}

	// บันทึกเครื่องเล่น
	if err := db.Create(&r).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": r})
}

// GET /ride/:id
func GetRide(c *gin.Context) {
	ID := c.Param("id")
	var ride entity.Ride

	db := config.DB()
	results := db.First(&ride, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if ride.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, ride)
}

// GET /rides
func ListRides(c *gin.Context) {
	var rides []entity.Ride

	db := config.DB()
	results := db.Find(&rides)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, rides)
}

// DELETE /rides/:id
func DeleteRide(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM rides WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /rides/:id
func UpdateRide(c *gin.Context) {
	var ride entity.Ride

	rideID := c.Param("id")

	db := config.DB()
	result := db.First(&ride, rideID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&ride); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&ride)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// CountRides นับจำนวนเครื่องเล่นทั้งหมด
func CountRides(c *gin.Context) {
	var count int64
	db := config.DB()
	if err := db.Model(&entity.Ride{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
