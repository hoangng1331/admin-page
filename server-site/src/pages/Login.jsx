import React from "react";
import { Form, Input, Button, Divider, Select } from "antd";
import { useAuthStore } from "../hooks/useAuthStore";
// const Login = () => {
export default function Login() {
  const { login } = useAuthStore((state) => state);
  const onFinish = (values, e) => {
    const { username, password, role } = values;
    login({ username, password, role });
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
            { type: "string", message: "Tên đăng nhập không hợp lệ" },
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
              min: 6,
              max: 10,
              message: "Độ dài mật khẩu phải nằm trong khoảng 6 đến 10 ký tự",
            },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Vị trí công việc"
          name="role"
          rules={[{ required: true, message: "Chưa chọn vị trí công việc" }]}
          hasFeedback
        >
          <Select placeholder="Chọn vị trí công việc">
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Chăm sóc khách hàng">
              Chăm sóc khách hàng
            </Select.Option>
            <Select.Option value="Giao hàng">Giao hàng</Select.Option>
            <Select.Option value="Quản lý">Quản lý</Select.Option>
          </Select>
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

