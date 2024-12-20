package entity

import "gorm.io/gorm"
     
type Ride struct {
    gorm.Model 
	RideName    string    `json:"RideName"`
	Description string    `json:"Description"`
	Capacity    int       `json:"capacity"`  
	Image       string    `json:"Image"`
    
	// 1 ride สามารถมีหลายรอบ
	RideSchedules [] RideSchedule `gorm:"foreignKey:ride_id"`
    
}
