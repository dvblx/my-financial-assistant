import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";

const Header = () => {
  return (
    <nav>
      <Breadcrumb style={{padding: '10px', border: "2px solid gray", borderRadius: '5px', margin: '0 0 10px 0', backgroundColor: ''}}
        items={[
          {
            //href: "",
            title: (
              <Link to="/">
                <HomeOutlined />
              </Link>
            ),
          },
          {
            //href: "/personal",
            title: (
              <>
                <Link to="/personal">
                  <UserOutlined />

                </Link>
              </>
            ),
          },
          {
            href: "/bank-accounts",
            title: "Банковские счета",
          },
          {
            href: "/cache-invoices",
            title: "Наличные счета",
          },
          {
            href: "/operations",
            title: "Операции",
          },
          {
            href: "/financial-goals",
            title: "Финансовые цели",
          },
          {
            href: "/regular-spends",
            title: "Регулярные траты",
          },
          {
            href: "/login",
            title: "Войти",
          },
          {
            href: "/register",
            title: "Зарегистрироваться",
          },
        ]}
      />
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <p>
          <Link to="/">home</Link>
        </p>
        <p>
          <Link to="/personal">personal</Link>
        </p>
        <p>
          <Link to="/bank-accounts">bank-accounts</Link>
        </p>
        <p>
          <Link to="/cache-invoices">cache-invoices</Link>
        </p>
        <p>
          <Link to="/operations">operations</Link>
        </p>
        <p>
          <Link to="/financial-goals">financial-goals</Link>
        </p>
        <p>
          <Link to="/regular-spends">regular-spends</Link>
        </p>
        <p>
          <Link to="/login">login</Link>
        </p>
        <p>
          <Link to="/register">register</Link>
        </p>
      </div> */}
    </nav>
  );
};

export default Header;
