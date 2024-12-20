package config

import (
	"fmt"
	"time"

	"backend/entity/ride"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// DB returns the database instance
func DB() *gorm.DB {
	return db
}

// ConnectionDB initializes the database connection
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

// SetupDatabase sets up the database schema and initial data
func SetupDatabase() {
	// Migrate the schema
	db.AutoMigrate(
		&entity.Ride{},           // Migrate the Ride entity
		&entity.RideSchedule{},   // Migrate the RideSchedule entity
		&entity.Booking{},        // Migrate the Booking entity
	)

	// Add initial Ride data
	rides := []entity.Ride{
		{
			RideName:    "ชิงช้าสวรรค์ | Ferris Wheel",
			Description: "สนุกสนานไปกับวิวทิวทัศน์จากมุมสูง | Enjoy breathtaking views from above.",
			Capacity:    40,
			Image:       "https://tse3.mm.bing.net/th?id=OIP.ql47Yt2eWduAj_JRljglLQHaE8&pid=Api&P=0&h=180", // Replace with an actual URL
		},
		{
			RideName:    "ม้าหมุน | Carousel",
			Description: "เหมาะสำหรับเด็กและผู้ใหญ่ที่ต้องการผ่อนคลาย | Perfect for children and adults seeking relaxation.",
			Capacity:    20,
			Image:       "https://png.pngtree.com/background/20230425/original/pngtree-carousel-with-horses-sitting-in-the-dark-at-night-picture-image_2474847.jpg", // Replace with an actual URL
		},
		{
			RideName:    "รถไฟเหาะ | Roller Coaster",
			Description: "ความเร็วสูงและหวาดเสียว พร้อมลูปที่ท้าทาย | High-speed thrills with daring loops.",
			Capacity:    20,
			Image:       "https://static01.nyt.com/images/2023/07/02/multimedia/29ROLLERCOASTER-02-lwgc/29ROLLERCOASTER-02-lwgc-videoSixteenByNine3000.jpg", // Correct image URL
		},
		{
			RideName:    "ไวกิ้ง | Viking Ship",
			Description: "ท้าทายกับแรงเหวี่ยงในเรือไวกิ้งขนาดใหญ่ | Experience the swinging excitement on a giant Viking ship.",
			Capacity:    30,
			Image:       "https://www.dreamworld.co.th/uploaded/images/1684742141202305227%E0%B8%94%E0%B8%A3%E0%B8%B5%E0%B8%A1%E0%B9%80%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%94%E0%B9%8C_%E0%B9%84%E0%B8%A7%E0%B8%81%E0%B8%B4%E0%B9%89%E0%B8%87%E0%B8%AA%E0%B9%8C2.jpg", // Replace with an actual URL
		},
		{
			RideName:    "กระเช้าหมุน | Spinning Basket",
			Description: "สัมผัสความหมุนในกระเช้ากลางอากาศ | Spin through the air in rotating baskets.",
			Capacity:    24,
			Image:       "https://www.dplusguide.com/wp-content/uploads/2018/01/happyvalley-5-657x301.jpg", // Replace with an actual URL
		},
		{
			RideName:    "ล่องแกง | River Rafting",
			Description: "สนุกไปกับการล่องแกงในแม่น้ำจำลอง | Enjoy rafting fun in a simulated river.",
			Capacity:    15,
			Image:       "https://www.dreamworld.co.th/uploaded/images/1684745510202305227%E0%B8%94%E0%B8%A3%E0%B8%B5%E0%B8%A1%E0%B9%80%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%94%E0%B9%8C_%E0%B9%81%E0%B8%81%E0%B8%A3%E0%B8%99%E0%B8%94%E0%B9%8C%E0%B9%81%E0%B8%84%E0%B8%99%E0%B8%A2%E0%B8%AD%E0%B8%991.jpg", // Replace with an actual URL
		},
		{
			RideName:    "บ้านผีสิง | Haunted House",
			Description: "ประสบการณ์สุดหลอนสำหรับผู้ที่ชอบความตื่นเต้น | A spine-chilling experience for thrill-seekers.",
			Capacity:    10,
			Image:       "https://capitalread.co/wp-content/uploads/2023/10/shutterstock_1723635454-1024x683.jpg", // Replace with an actual URL
		},
		// Add more rides here if needed
	}

	// Insert initial data if not already present
	for _, ride := range rides {
		db.FirstOrCreate(&ride, entity.Ride{RideName: ride.RideName})
	}

	fmt.Println("Initial rides data inserted")

	// Add initial RideSchedule data
	for _, ride := range rides {
		var schedules []entity.RideSchedule

		// Create ride schedules
		hour := 8
		minute := 0
		for hour < 21 || (hour == 20 && minute < 45) { // Ends at 20:45
			startTime := fmt.Sprintf("%02d:%02d", hour, minute)
			minute += 45
			if minute >= 60 {
				hour += 1
				minute -= 60
			}
			endTime := fmt.Sprintf("%02d:%02d", hour, minute)

			schedule := entity.RideSchedule{
				StartTime: startTime,
				EndTime:   endTime,
				Capacity:  uint(ride.Capacity),
				RideID:    ride.ID,
			}
			schedules = append(schedules, schedule)
		}

		// Insert schedules into the database
		for _, schedule := range schedules {
			db.FirstOrCreate(&schedule, entity.RideSchedule{StartTime: schedule.StartTime, RideID: ride.ID})
		}
	}

	fmt.Println("Initial ride schedules inserted")

	// Add an initial Booking using RideSchedule StartTime
	var rideSchedule entity.RideSchedule
	// Fetch a valid RideSchedule for the first ride (index 0) - you can change this as per your requirement
	db.Where("ride_id = ?", rides[0].ID).First(&rideSchedule)

	// Ensure a valid RideSchedule was found
	if rideSchedule.ID == 0 {
		fmt.Println("No valid RideSchedule found for booking.")
		return
	}

	// Parse StartTime from string to time.Time
	startTimeStr := rideSchedule.StartTime
	layout := "15:04" // Define layout based on how the time is stored (HH:mm format)

	// Parse the time string into time.Time object
	startTime, err := time.Parse(layout, startTimeStr)
	if err != nil {
		fmt.Println("Error parsing StartTime:", err)
		return
	}

	// Insert booking with RideSchedule StartTime as the booking time
	initialBooking := entity.Booking{
		BookingDate:    "2024-12-21", // Use your desired booking date
		TicketID:       1,             // Change the ticket ID if needed
		Time:           startTime,     // Use the parsed time
		RideID:         rides[0].ID,    // Use the first ride's ID (Ferris Wheel)
		RideScheduleID: rideSchedule.ID, // Use the RideSchedule ID
	}

	// Insert the initial booking into the database
	db.FirstOrCreate(&initialBooking, entity.Booking{TicketID: initialBooking.TicketID, RideID: initialBooking.RideID})
	fmt.Println("Initial booking data inserted")
}
