package entity

import (
	"time"

	"gorm.io/gorm"
)

type Booking struct {
	gorm.Model
	BookingDate string        `json:"booking_date"`
	TicketID    uint          `json:"ticket_id"`
	Time        time.Time     `json:"time"`
	
	// RideID ทำหน้าที่เป็น FK
	RideID uint
	Ride   Ride `gorm:"foriegnKey:ride_id"`

	// RideID ทำหน้าที่เป็น FK
	RideScheduleID uint
	RideSchedule   Ride `gorm:"foriegnKey:ride_schedule_id"`


}
