import React, { useState } from "react";
import { Layout, Form, Input, Button, Row, Col, message, InputNumber } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "../../../../components/sidebar";
import { CreateRide } from "../../../../services/https/ride/index";  // Import CreateRide function

const { Content } = Layout;

const CreateRidePage: React.FC = () => {
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | null>(null);
  const navigate = useNavigate(); 

  // Function to handle form submission
  const onFinish = async (values: any) => {
    // Combine form values and image data
    const rideData = { ...values, image };
    
    try {
      // Send data to API to create the ride
      const response = await CreateRide(rideData);
      
      if (response) {
        message.success("Ride added successfully!");
        // Redirect to the rides page after success
        navigate("/rides");
      } else {
        message.error("Failed to add ride. Please try again.");
      }
    } catch (error) {
      console.error("Error creating ride:", error);
      message.error("An error occurred while adding the ride.");
    }
  };

  // Handle image drop/upload
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);  // Set the image as base64 string
      };
      reader.readAsDataURL(file);  // Read the file as base64
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],  // Allow image files only
    },
    multiple: false,
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <Content
          style={{
            margin: "16px",
            backgroundColor: "#8ECAE6",
            color: "#2671BC",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <h2 style={{ color: "#2671BC", fontSize: "36px", fontWeight: "bold" }}>
              Create Ride
            </h2>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "5px solid #2671BC",
              margin: "5px 0 20px 0",
            }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{
              backgroundColor: "#FFFFFF",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={10}>
                <Form.Item
                  label="Ride Image"
                  name="rideImage"  // Change name to "rideImage" instead of "image"
                  rules={[{ required: true, message: "Please upload an image!" }]}
                >
                 <div
                    {...getRootProps()}
                      style={{
                      border: "2px dashed #2671BC",
                      padding: "40px",
                      textAlign: "center",
                      borderRadius: "8px",
                      backgroundColor: "#f0f8ff",
                      cursor: "pointer",
                      }}
                  >
                <input {...getInputProps()} />
                <UploadOutlined style={{ fontSize: "20px", color: "#2671BC" }} />
                <p>Drag & drop an image here, or click to select a file</p>
                </div>
                  {image && (
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={image}
                        alt="Ride Preview"
                        style={{
                          width: "150px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginTop: "10px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                     />
                </div>
                  )}
                </Form.Item>
              </Col>

              <Col xs={24} sm={14}>
                <Form.Item
                  label="Ride Name"
                  name="rideName"
                  rules={[{ required: true, message: "Please enter the ride name!" }]}
                >
                  <Input placeholder="Enter ride name" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: "Please enter a description!" }]}
                >
                  <Input.TextArea placeholder="Enter ride description" />
                </Form.Item>

                <Form.Item
                  label="Capacity"
                  name="capacity"
                  rules={[{ required: true, message: "Please enter the ride capacity!" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={1}
                    max={1000}
                    placeholder="Enter ride capacity"
                  />
                </Form.Item>

                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#219EBC",
                      border: "none",
                      color: "white",
                      borderRadius: "8px",
                      padding: "8px 20px",
                    }}
                    icon={<PlusOutlined />}
                  >
                    Create Ride
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateRidePage;
