import { Button, Form, Input, Card } from "antd";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { setUser } from "../redux/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:9999/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.username, password: values.password }),
      });

      const data = await response.json();
      if (response.ok) {
        //Save the token in Redux
        dispatch(login(data.token));
        //Get the user info from token and save it in Redux
        const decoded = jwtDecode(data.token);
        console.log(decoded)
        dispatch(setUser({
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        }));

      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <Card title="Login" className="card">
        <Form onFinish={onFinish}>
          <Form.Item label="Email" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default LoginPage
