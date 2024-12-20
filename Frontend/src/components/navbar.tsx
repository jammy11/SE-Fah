import React from "react";
import { GiCastle } from "react-icons/gi"; // Import Castle Icon
import { Menu, Layout, Button } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const Navbar: React.FC = () => {
  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        zIndex: 50,
        background: "transparent", // โปร่งใส
        padding: "20px 40px",
      }}
    >
      <div
        className="container flex justify-between items-center"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Logo Section */}
        <div
          className="flex items-center gap-4 font-bold italic text-3xl text-black" // Set text color to black
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "black", // Black text for logo
            fontSize: "28px",
          }}
        >
          <GiCastle style={{ fontSize: "36px", color: "black" }} /> {/* Castle Icon */}
          <span>CASTLE-KINGDOM</span>
        </div>

        {/* Navigation Links */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{
            flex: 1,
            justifyContent: "center",
            display: "flex",
            background: "transparent",
            borderBottom: "none",
            fontSize: "16px",
            gap: "15px",
          }}
        >
          {["Home", "Ride", "Food and Beverage", "Merchandise"].map((item, index) => (
            <Menu.Item
              key={index}
              style={{
                color: "black", // Black text for menu items
                fontWeight: "500",
                fontSize: "18px",
              }}
            >
              <a href={`/#${item.replace(" ", "")}`}>{item}</a>
            </Menu.Item>
          ))}
        </Menu>

        {/* Sign Up and Login Buttons */}
        <div style={{ display: "flex", gap: "15px" }}>
          <Link to="/register">
            <Button
              type="primary"
              style={{
                backgroundColor: "#FFB703", // Hot Yellow
                borderColor: "#FFB703",
                color: "black",
                fontWeight: "500",
                borderRadius: "5px",
                padding: "8px 16px",
                transition: "all 0.3s",
              }}
              className="hover:bg-orange-500 hover:text-white"
            >
              Sign up
            </Button>
          </Link>
          <Link to="/login">
            <Button
              type="default"
              style={{
                backgroundColor: "#FFB703", 
                color: "black",
                borderColor: "#FFB703",
                fontWeight: "500",
                borderRadius: "5px",
                padding: "8px 16px",
                transition: "all 0.3s",
              }}
              className="hover:bg-blue-700 hover:text-white"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
