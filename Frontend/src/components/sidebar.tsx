import React from "react";
import { Layout, Menu, Button } from "antd";
import {
  ShopOutlined, // Merchandise
  FileTextOutlined, // Event
  CoffeeOutlined, // Food and Beverage
  CarOutlined, // Transportation
  ContainerOutlined, // Stock
  RocketOutlined, // Ride
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const handleLogout = () => {
    // ฟังก์ชั่นสำหรับออกจากระบบ
    console.log("Logging out...");
    // เพิ่มการทำงานที่เกี่ยวข้องกับการออกจากระบบที่นี่
  };

  return (
    <Sider theme="dark" width={240}>
      <div className="logo" style={{ padding: "20px", color: "white", fontSize: "20px", textAlign: "center" }}>
        Management Systems
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]}>
        <Menu.Item key="1" icon={<FileTextOutlined />}>
          Event
        </Menu.Item>
        <Menu.Item key="2" icon={<CoffeeOutlined />}>
          Food and Beverage
        </Menu.Item>
        <Menu.Item key="3" icon={<CarOutlined />}>
          Transportation
        </Menu.Item>
        <Menu.Item key="4" icon={<ShopOutlined />}>
          Merchandise
        </Menu.Item>
        <Menu.Item key="5" icon={<ContainerOutlined />}>
          Stock
        </Menu.Item>
        <Menu.Item key="6" icon={<RocketOutlined />}>
          Ride
        </Menu.Item>
      </Menu>
      <div style={{ position: "absolute", bottom: "20px", left: "0", right: "0", padding: "10px" }}>
        <Button
          type="primary"
          block
          onClick={handleLogout}
          style={{
            backgroundColor: "#2671BC", // สีพื้นหลังของปุ่ม
            color: "white", // สีข้อความในปุ่ม
            fontWeight: "bold", // ตัวหนาของข้อความ
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" // เงาของปุ่ม
          }}
        >
          Log Out
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
