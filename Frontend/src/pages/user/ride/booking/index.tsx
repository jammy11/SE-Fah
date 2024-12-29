// import React from 'react';
// import { Layout, Button, Form, Input, Select, DatePicker, Card } from 'antd';
// import { useLocation } from 'react-router-dom';
// import Navbar from '../../../../components/navbar';
// import RideCard from '../../../../components/RideCard';

// const { Option } = Select;

// const generateTimeOptions = () => {
//   const timeOptions = [];
//   let start = 8 * 60;
//   const end = 21 * 60;

//   while (start + 45 <= end) {
//     const startHour = Math.floor(start / 60);
//     const startMinute = start % 60;
//     const endHour = Math.floor((start + 45) / 60);
//     const endMinute = (start + 45) % 60;

//     const timeRange = `${String(startHour).padStart(2, '0')}.${String(startMinute).padStart(2, '0')} - ${String(endHour).padStart(2, '0')}.${String(endMinute).padStart(2, '0')} น.`;
//     timeOptions.push(timeRange);
//     start += 60;
//   }

//   return timeOptions;
// };

// const Booking: React.FC = () => {
//   const { state } = useLocation();
//   const ride = state?.ride;

//   if (!ride) {
//     return <div>ไม่พบข้อมูลเครื่องเล่น</div>;
//   }

//   const onFinish = (values: any) => {
//     console.log('ข้อมูลที่กรอก: ', values); // แสดงค่าที่กรอก
//     // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
//     if (!values.Ticket || !values.date || !values.time) {
//       alert('กรุณากรอกข้อมูลให้ครบถ้วน');
//       return;
//     }
//     // ข้อมูลจะถูกแสดงที่นี่ แทนการส่งไปยัง API
//     alert('การจองสำเร็จ');
//   };

//   return (
//     <Layout
//       className="layout"
//       style={{
//         background: 'linear-gradient(to bottom, #57DACC , #FFDAB9)',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         paddingTop: '64px',
//       }}
//     >
//       <Navbar />

//       <div style={{ width: '50%', padding: '100px', display: 'flex', justifyContent: 'center' }}>
//         <RideCard ride={ride} />
//       </div>

//       <div
//         style={{
//           width: '45%',
//           padding: '60px',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}
//       >
//         <Card
//           style={{
//             width: '100%',
//             maxWidth: '500px',
//             borderRadius: '10px',
//             backgroundColor: 'rgba(255, 255, 255, 0.7)',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//           }}
//         >
//           <Form name="bookingForm" onFinish={onFinish} layout="vertical">
//             <Form.Item
//               label="Ticket"
//               name="Ticket"
//               rules={[{ required: true, message: 'กรุณากรอก Ticket' }]}
//             >
//               <Input placeholder="กรอก TicTik ของคุณ" />
//             </Form.Item>

//             <Form.Item
//               label="เลือกวันที่"
//               name="date"
//               rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
//             >
//               <DatePicker style={{ width: '100%' }} />
//             </Form.Item>

//             <Form.Item
//               label="เลือกช่วงเวลา"
//               name="time"
//               rules={[{ required: true, message: 'กรุณาเลือกเวลา' }]}
//             >
//               <Select placeholder="เลือกช่วงเวลา" style={{ width: '100%' }}>
//                 {generateTimeOptions().map((time, index) => (
//                   <Option key={index} value={time}>
//                     {time}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item style={{ textAlign: 'center' }}>
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 style={{
//                   width: '100%',
//                   fontSize: '16px',
//                   backgroundColor: '#FF7F50',
//                   borderColor: '#FF7F50',
//                 }}
//               >
//                 ยืนยันการจอง
//               </Button>
//             </Form.Item>
//           </Form>
//         </Card>
//       </div>
//     </Layout>
//   );
// };

// export default Booking;
import React from 'react';
import { Layout, Button, Form, Input, Select, DatePicker, Card } from 'antd';
import { useLocation } from 'react-router-dom';
import Navbar from '../../../../components/navbar';
import RideCard from '../../../../components/RideCard';
import { CreateBooking } from '../../../../services/https/ิbooking';
import { BookingInterface } from '../../../../interfaces/IBooking';

const { Option } = Select;

/**
 * Generates a list of time slots between 08:00 and 21:00, each lasting 45 minutes.
 */
const generateTimeOptions = () => {
  const timeOptions = [];
  let start = 8 * 60; // Start time in minutes (08:00 AM)
  const end = 21 * 60; // End time in minutes (09:00 PM)

  while (start + 45 <= end) {
    const startHour = Math.floor(start / 60);
    const startMinute = start % 60;
    const endHour = Math.floor((start + 45) / 60);
    const endMinute = (start + 45) % 60;

    const timeRange = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')} - ${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')} น.`;
    timeOptions.push(timeRange);
    start += 60; // Increment by 1 hour
  }

  return timeOptions;
};

/**
 * Booking component for creating a ride booking.
 */
const Booking: React.FC = () => {
  const { state } = useLocation();
  const ride = state?.ride;

  if (!ride) {
    return <div>ไม่พบข้อมูลเครื่องเล่น</div>;
  }

  /**
   * Handles form submission to create a booking.
   * @param values - Form values entered by the user.
   */
  const onFinish = async (values: any) => {
    const bookingData: BookingInterface = {
      TicketID: Number(values.Ticket),
      Date: values.date.format("YYYY-MM-DD"),
      Time: values.time,
      RideID: ride.RideID,
    };

    try {
      const result = await CreateBooking(bookingData);
      if (result) {
        alert("การจองสำเร็จ");
        console.log("ข้อมูลที่บันทึก:", result);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  return (
    <Layout
      className="layout"
      style={{
        background: 'linear-gradient(to bottom, #57DACC , #FFDAB9)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: '64px',
      }}
    >
      <Navbar />

      <div style={{ width: '50%', padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <RideCard ride={ride} />
      </div>

      <div
        style={{
          width: '45%',
          padding: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Form name="bookingForm" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Ticket"
              name="Ticket"
              rules={[
                { required: true, message: 'กรุณากรอก Ticket' },
                { pattern: /^\d+$/, message: 'กรุณากรอกตัวเลขเท่านั้น' },
              ]}
            >
              <Input placeholder="กรอก Ticket ของคุณ" />
            </Form.Item>

            <Form.Item
              label="เลือกวันที่"
              name="date"
              rules={[{ required: true, message: 'กรุณาเลือกวันที่' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="เลือกช่วงเวลา"
              name="time"
              rules={[{ required: true, message: 'กรุณาเลือกเวลา' }]}
            >
              <Select placeholder="เลือกช่วงเวลา" style={{ width: '100%' }}>
                {generateTimeOptions().map((time, index) => (
                  <Option key={index} value={time}>
                    {time}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '100%',
                  fontSize: '16px',
                  backgroundColor: '#FF7F50',
                  borderColor: '#FF7F50',
                }}
              >
                ยืนยันการจอง
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default Booking;
