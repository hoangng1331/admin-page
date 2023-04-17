import React from 'react';
import { Form, Input, Button, Checkbox, Divider, message, Select } from 'antd';
import { axiosClient } from '../libraries/axiosClient';
import {useAuthStore} from '../hooks/useAuthStore'
// const Login = () => {
  export default function Login() {
    const { login } = useAuthStore((state) => state);
  const onFinish = (values, e) => {
    const { username, password, role } = values;
    login({ username, password, role });
    // window.location.href = '/home';
    
    //  axiosClient
    //   .post('/auth/login-jwt', { username, password, role })
    //   .then((response) => {
    //     // LOGIN OK
    //     window.location.href = '/home';
    //     console.log(response.data);
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 401) {
    //       message.error('Đăng nhập không thành công!');
    //       e.preventDefault();
    //       return false;
    //     }
    //   });
  };

  const onFinishFailed = (errorInfo, event) => {
        console.log('Failed:', errorInfo);
        message.error('Đăng nhập không thành công!')
        event.preventDefault();
        return false;
  };

  return (
    <React.Fragment>
      <h3>Login</h3>
      <Divider />
      <Form name='login-form' labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} initialValues={{ username: '', password: '', remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete='off'>
        <Form.Item
          label='Tên đăng nhập'
          name='username'
          rules={[
            { required: true, message: 'Tên đăng nhập được để trống' },
            { type: 'string', message: 'Tên đăng nhập không hợp lệ' },
          ]}
        >
          <Input placeholder='Nhập tên đăng nhập' />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            { required: true, message: 'Mật khẩu không được để trống' },
            { min: 6, max: 10, message: 'Độ dài mật khẩu phải nằm trong khoảng 6 đến 10 ký tự' },
          ]}
        >
          <Input.Password placeholder='Nhập mật khẩu' />
        </Form.Item>

        <Form.Item label="Vị trí công việc" name='role' rules={[{ required: true, message: 'Chưa chọn vị trí công việc' }]} hasFeedback>
          <Select placeholder='Chọn vị trí công việc'>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="Chăm sóc khách hàng">Chăm sóc khách hàng</Select.Option>
            <Select.Option value="Giao hàngr">Giao hàng</Select.Option>  
            <Select.Option value="Quản lý">Quản lý</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='remember' valuePropName='checked' wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit' style={{ minWidth: 120 }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

// export default Login;
