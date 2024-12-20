package entity

import (
	"gorm.io/gorm"
)

type RideSchedule struct {
	gorm.Model
	StartTime   string  `json:"start_time"`
	EndTime     string  `json:"end_time"`
	Capacity    uint    `json:"capacity"`
	

	// RideID ทำหน้าที่เป็น FK
	RideID uint
	Ride   Ride `gorm:"foriegnKey:ride_id"`

}
