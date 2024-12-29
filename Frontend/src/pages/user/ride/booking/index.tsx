import React from 'react';
import { Layout, Button, Form, Input, Select, DatePicker, Card } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../../../components/navbar';
import RideCard from '../../../../components/RideCard';



const { Option } = Select;

const generateTimeOptions = () => {
  const timeOptions = [];
  let start = 8 * 60;
  const end = 21 * 60;

  while (start + 45 <= end) {
    const startHour = Math.floor(start / 60);
    const startMinute = start % 60;
    const endHour = Math.floor((start + 45) / 60);
    const endMinute = (start + 45) % 60;

    const timeRange = `${String(startHour).padStart(2, '0')}.${String(startMinute).padStart(2, '0')} - ${String(endHour).padStart(2, '0')}.${String(endMinute).padStart(2, '0')} น.`;
    timeOptions.push(timeRange);
    start += 60;
  }

  return timeOptions;
};

const Booking: React.FC = () => {
  const { state } = useLocation();
  const ride = state?.ride;

  if (!ride) {
    return <div>ไม่พบข้อมูลเครื่องเล่น</div>;
  }

  const onFinish = async (values: any) => {
    console.log('ข้อมูลที่กรอก: ', values); // เพิ่มการแสดงค่าที่กรอกเพื่อการตรวจสอบ

    // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
    if (!values.TicTik || !values.date || !values.time) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    try {
      // ตรวจสอบข้อมูลก่อนส่งไปยัง API
      console.log('กำลังส่งข้อมูลไปยัง API...');
      const response = await axios.post(`http://localhost:3036/bookings`, {
        Ticket: values.ticket_id,
        date: values.date.format('YYYY-MM-DD'), // ตรวจสอบรูปแบบวันที่
        time: values.time,
        rideId: ride.id,
});


      if (response.status === 200) {
        alert('การจองสำเร็จ');
        // ทำอะไรต่อหลังจากการจองสำเร็จ เช่น redirect ไปหน้าอื่น หรือ reset form
      } else {
        alert('การจองไม่สำเร็จ');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
      alert('เกิดข้อผิดพลาดในการจอง');
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
              label="TicTik"
              name="TicTik"
              rules={[{ required: true, message: 'กรุณากรอก TicTik' }]}
            >
              <Input placeholder="กรอก TicTik ของคุณ" />
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
