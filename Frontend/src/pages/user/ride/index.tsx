import React, { useEffect, useState } from 'react';
import { Layout, Spin, Card, Button, Row, Col, message } from 'antd';
import Navbar from '../../../components/navbar';
import themeParkImage from '../../../assets/5.jpg';
import { GetRides } from '../../../services/https/ride';

interface Ride {
  RideID: number;
  RideName: string;
  Description: string;
  Capacity: number;
  Requirements: string;
  Image?: string; // Optional หากไม่มีภาพ
}

const Ride: React.FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data = await GetRides();
        setRides(data || []);
      } catch (error) {
        message.error('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  return (
    <Layout
      className="layout"
      style={{
        background: 'linear-gradient(to bottom, #57DACC , #FFDAB9)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <div style={{ marginTop: '80px' }}>
        <img
          src={themeParkImage}
          alt="Theme Park"
          style={{
            width: '100%',
            maxWidth: '1350px',
            height: 'auto',
            objectFit: 'cover',
            margin: '0 auto',
            display: 'block',
          }}
        />
      </div>

      {loading ? (
        <Spin
          size="large"
          style={{
            marginTop: '20px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      ) : (
        <Row
          gutter={[16, 24]}
          style={{
            width: '90%',
            marginTop: '20px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {rides.map((ride) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={ride.RideID}>
              <Card
                hoverable
                cover={
                  <img
                    alt="ride"
                    src={ride.Image || '/default-placeholder.png'} // หากไม่มีภาพให้ใช้ placeholder
                    style={{ height: '200px', objectFit: 'cover',borderTopLeftRadius: '15px',
                      borderTopRightRadius: '15px', }}
                    loading="lazy" // ใช้ lazy-load
                  />
                }
                bordered={false}
                style={{
                  borderRadius: '15px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(to bottom, #FFFAF0, #FFDAB9)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Card.Meta
                  title={<strong>{ride.RideName}</strong>}
                  description={
                    <>
                      <div
                        style={{
                          height: '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        <p>{ride.Description}</p>
                      </div>
                      <p>
                        <strong>Capacity:</strong> {ride.Capacity}
                      </p>
                    </>
                  }
                />
                <Button
                  type="primary"
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    backgroundColor: '#FF7F50',
                    borderColor: '#FF7F50',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                  }}
                  onClick={() => alert(`จองเครื่องเล่น: ${ride.RideName}`)}
                >
                  จอง
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Layout>
  );
};

export default Ride;
