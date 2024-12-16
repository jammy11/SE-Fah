package entity

import "gorm.io/gorm"
     
type Ride struct {
    gorm.Model 
	RideName    string     // ชื่อเครื่องเล่น
	Description string     // คำอธิบาย
	Capacity    int        // ความจุ
	Image       string     // URL ภาพ
    
    
}
