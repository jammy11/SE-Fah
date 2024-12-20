package controller

import (
	"backend/config"
	"backend/entity/ride"
	"net/http"
	"github.com/gin-gonic/gin"
)

// CreateRideSchedule สร้างตารางเวลาของเครื่องเล่นใหม่
func CreateRideSchedule(c *gin.Context) {
	var schedule entity.RideSchedule

	// bind ข้อมูลจาก JSON เข้าตัวแปร schedule
	if err := c.ShouldBindJSON(&schedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้างตารางเวลาของเครื่องเล่นใหม่
	newSchedule := entity.RideSchedule{
		StartTime: schedule.StartTime,
		EndTime:   schedule.EndTime,
		Capacity:  schedule.Capacity,
		RideID:    schedule.RideID,
	}

	// บันทึกตารางเวลา
	if err := db.Create(&newSchedule).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": newSchedule})
}

// GET /rideschedule/:id
func GetRideSchedule(c *gin.Context) {
	ID := c.Param("id")
	var schedule entity.RideSchedule

	db := config.DB()
	results := db.Preload("Ride").Preload("Bookings").First(&schedule, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if schedule.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, schedule)
}

// GET /rideschedules
func ListRideSchedules(c *gin.Context) {
	var schedules []entity.RideSchedule

	db := config.DB()
	results := db.Preload("Ride").Preload("Bookings").Find(&schedules)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, schedules)
}

// DELETE /rideschedules/:id
func DeleteRideSchedule(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM ride_schedules WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /rideschedules/:id
func UpdateRideSchedule(c *gin.Context) {
	var schedule entity.RideSchedule

	scheduleID := c.Param("id")

	db := config.DB()
	result := db.First(&schedule, scheduleID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&schedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&schedule)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// CountRideSchedules นับจำนวนตารางเวลาของเครื่องเล่นทั้งหมด
func CountRideSchedules(c *gin.Context) {
	var count int64
	db := config.DB()
	if err := db.Model(&entity.RideSchedule{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
