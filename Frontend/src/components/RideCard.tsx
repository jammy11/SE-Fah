// RideCard.tsx
import React from 'react';
import { Card } from 'antd';

interface Ride {
  RideID: number;
  RideName: string;
  Description: string;
  Image?: string;
}

interface RideCardProps {
  ride: Ride;  // ไม่ใช้ [x: string]: ReactNode
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt="ride"
          src={ride.Image || '/default-placeholder.png'}
          style={{
            height: '200px',
            objectFit: 'cover',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
          }}
          loading="lazy"
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
        }
      />
    </Card>
  );
};

export default RideCard;
