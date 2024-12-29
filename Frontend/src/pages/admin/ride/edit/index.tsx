import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, Row, Col, Spin, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Sidebar from "../../../../components/sidebar";
import { UpdateRide } from "../../../../services/https/ride/index";
import { InputNumber } from "antd";


const { Content } = Layout;

export interface RideInterface {
  RideName?: string;
  Description?: string;
  Capacity?: number;
  Image?: string;
}

const EditRidePage: React.FC = () => {
  const { state } = useLocation();
  const ride = state?.ride;
  const [form] = Form.useForm();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // โหลดข้อมูลเริ่มต้นของเครื่องเล่น
  useEffect(() => {
    if (ride) {
      form.setFieldsValue({
        RideName: ride.RideName,
        Description: ride.Description,
        Capacity: ride.capacity,
      });
      setImage(ride.Image || null);
    }
    setLoading(false);
  }, [ride, form]);

  // ฟังก์ชันสำหรับบันทึกการแก้ไขเครื่องเล่น
  const onFinish = async (values: any) => {
    console.log("Form values:", values); // ตรวจสอบค่า
    try {
      if (!image) {
        message.error("Please upload an image!");
        return;
      }
  
      // สร้างข้อมูลอัปเดต
      const updatedRide = { RideID: ride?.RideID, ...values, Image: image };
  
      // ตรวจสอบว่า RideID ตรงกันหรือไม่
      if (values.RideID && values.RideID !== ride?.RideID) {
        message.error("Ride ID mismatch! Cannot update the ride.");
        return;
      }
  
      console.log("Updated ride data:", updatedRide);
  
      // ส่งข้อมูลอัปเดต
      const success = await UpdateRide(updatedRide);
      if (success) {
        message.success("Ride updated successfully!");
        form.resetFields();
        navigate("/rides");
      } else {
        message.error("Failed to update ride. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error("An error occurred while updating the ride.");
    }
  }; 

  // ฟังก์ชันสำหรับการอัปโหลดรูปภาพ
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
  });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Loading ride details..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Content
          style={{
            margin: "16px",
            backgroundColor: "#8ECAE6",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <h2 style={{ color: "#2671BC", fontSize: "36px", fontWeight: "bold" }}>Edit Ride</h2>
          </div>
          <hr style={{ border: "none", borderTop: "5px solid #2671BC", margin: "5px 0 20px 0" }} />
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
                <Form.Item label="Ride Image">
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
                    <p style={{ margin: "10px 0", color: "#2671BC" }}>
                      Drag & drop an image here, or click to select a file
                    </p>
                  </div>
                  {image && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
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
                  name="RideName"
                  rules={[{ required: true, message: "Please input the ride name!" }]}
                >
                  <Input placeholder="Enter ride name" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="Description"
                  rules={[{ required: true, message: "Please input the ride description!" }]}
                >
                  <Input.TextArea rows={3} placeholder="Enter ride description" />
                </Form.Item>

                
                <Form.Item
                  label="Capacity"
                  name="Capacity"
                  rules={[{ required: true, message: "Please input the ride capacity!" }]}
                  >
                <InputNumber placeholder="Enter ride capacity" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                style={{
                  backgroundColor: "#FFB703",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  marginTop: "20px",
                }}
              >
                Save Changes
              </Button>
            </Row>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditRidePage;
