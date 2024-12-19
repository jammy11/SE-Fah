import React, { useState, useEffect } from "react";
import { Layout, Card, Button, Row, Col, Divider, Spin, Alert, message, Modal } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { GetRides, DeleteRideByID } from "../../../services/https/ride/index";

const { Content } = Layout;

const RidePage: React.FC = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rides
  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const data = await GetRides();
        if (data) {
          setRides(data);
        } else {
          throw new Error("Failed to fetch rides.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching rides.");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  // Handle editing a ride
const editRide = (ride: any) => {
  navigate(`/editrides/${ride.ID}`, { state: { ride } }); // ส่งข้อมูล ride ไปยัง EditRidePage
};


  // Handle deleting a ride with confirmation
  const deleteRide = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this ride?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          setLoading(true);
          // Convert the ID to a number (if applicable)
          const idAsNumber = Number(id);
          if (isNaN(idAsNumber)) {
            message.error("Invalid ID format.");
            return;
          }
          const success = await DeleteRideByID(idAsNumber); // Pass the numeric ID to the API
          if (success) {
            message.success("Ride deleted successfully!");
            setRides(rides.filter((ride) => ride.ID !== id)); // Remove ride from UI
          } else {
            message.error("Failed to delete ride. Please try again.");
          }
        } catch (error) {
          message.error("An error occurred while deleting the ride.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <Spin
        tip="Loading rides..."
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "50px",
        }}
      />
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#E0F7FA" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <Layout>
        <Content
          style={{
            margin: "16px",
            backgroundColor: "#8ECAE6",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ color: "#005F73", fontSize: "26px", fontWeight: "bold" }}>
              🎡 Rides Management
            </h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/createrides")}
              style={{
                backgroundColor: "#219EBC",
                border: "none",
                color: "white",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
              }}
            >
              Add Ride
            </Button>
          </div>

          <Divider style={{ borderColor: "#FFFFFF", margin: "20px 0" }} />

          {/* Ride Cards */}
          <Row gutter={[16, 16]}>
            {rides.map((ride: any) => (
              <Col xs={24} sm={12} md={8} lg={6} key={ride.ID}>
                <Card
                  hoverable
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                  }}
                  cover={
                    <img
                      alt={ride.RideName}
                      src={
                        ride.Image ||
                        "https://via.placeholder.com/300x180?text=No+Image"
                      }
                      style={{
                        height: "180px",
                        objectFit: "cover",
                      }}
                    />
                  }
                >
                  <div style={{ padding: "12px" }}>
                    <h3 style={{ color: "#005F73", fontWeight: "bold" }}>
                      {ride.RideName} {/* Make sure 'RideName' matches the API response */}
                    </h3>
                    <p style={{ color: "#6D6875", marginBottom: "8px" }}>
                      {ride.Description}
                    </p>
                    <p style={{ color: "#023047" }}>
                      <strong>Capacity:</strong> {ride.Capacity}
                    </p>

                    {/* Buttons */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <Button
                        icon={<EditOutlined />}
                        size="small"
                        style={{
                          backgroundColor: "#FB8500",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                        }}
                        onClick={() => editRide(ride)} // Call editRide function
                      >
                        Edit
                      </Button>
                      <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        style={{
                          backgroundColor: "#E63946",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontWeight: "bold",
                        }}
                        onClick={() => deleteRide(ride.ID)} // Call deleteRide function
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RidePage;
