package entity

import (
	"gorm.io/gorm"
)

type Booking struct {
	gorm.Model
	TicketID    uint   `json:"ticket_id"`
	Date 		string `json:"date"`
	Time        string `json:"time"`

	// RideID เป็น FK ที่เชื่อมกับตาราง Ride
	RideID uint
	Ride   Ride `gorm:"foreignKey:ride_id"`
}
