import React from "react";
import { Form, Input, Button, Divider, Select } from "antd";
import { useAuthStore } from "../hooks/useAuthStore";
// const Login = () => {
export default function Login() {
  const validateUsername = (rule, value, callback) => {
    const regex = /^[A-Za-z0-9_\.@]+$/;
    if (!value || value.trim() === '' || regex.test(value)) {
      callback();
    } else {
      callback('Tên đăng nhập không hợp lệ');
    }
  };
  const { login } = useAuthStore((state) => state);
  const onFinish = (values, e) => {
    const { username, password } = values;
    login({ username, password });
  };

  return (
    <React.Fragment>
      <h3>Login</h3>
      <Divider />
      <Form
        name="login-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ username: "", password: "", remember: true }}
        onFinish={onFinish}
        autoComplete="on"
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Tên đăng nhập được để trống" },
            { validator: validateUsername },
          ]}
        >
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Mật khẩu không được để trống" },
            {
              min: 1,
              max: 30,
              message: "Độ dài mật khẩu phải nằm trong khoảng 1 đến 30 ký tự",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ minWidth: 120 }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
}

