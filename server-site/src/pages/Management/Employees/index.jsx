import React from "react";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  message,
  Space,
  Modal,
  Select,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { axiosClient } from "../../../libraries/axiosClient";
import moment from "moment";

export default function Employees() {
  const [employees, setEmployees] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [accountLogin, setAccountLogin] = React.useState([]);
  const [number, setNumber] = React.useState();
  const [idSelect, setIdSelect] = React.useState();
  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosClient.get("/login/");
        setAccountLogin(response.data.map((item,index) => item._id));
        console.log("Login:", accountLogin);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const columns = [
    {
      title: 'STT', 
      width: '1%',
      render: (text, record, index) => {
        return (
          <div style = {{textAlign: 'right'}}>
            <span>{index+1}</span>
          </div>
        )
      },
      key: 'number',
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => {
        return <strong style={{ color: "blue" }}>{text}</strong>;
      },
    },
    {
      title: "Công việc",
      dataIndex: "role",
      key: "role",
      width: "1%",
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      width: "1%",
    },
    {
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
      width: "1%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => {
        return <em>{text}</em>;
      },
    },
    {
      title: "Thư điện tử",
      dataIndex: "email",
      key: "email",
      width: "1%",
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "1%",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      width: "1%",
      render: (text) => {
        return <span>{moment(text).format("DD/MM/yyyy")}</span>;
      },
    },
    {
      title: "",
      key: "actions",
      width: "1%",
      render: (text, record,index) => {
        return (
          <Space>
            <Popconfirm
              style={{ width: 800 }}
              title="Are you sure to delete?"
              onConfirm={() => {
                // DELETE
                const id = record._id;

                axiosClient
                  .delete("/employees/" + id)
                  .then((response) => {
                    message.success("Xóa thành công!");
                    setRefresh((f) => f + 1);
                  })
                  .catch((err) => {
                    message.error("Xóa bị lỗi!");
                  });
                console.log("DELETE", record);
                axiosClient
                  .delete("/login/" + accountLogin[idSelect])
                  .then((response) => {
                    message.success("Xóa thành công!");
                    setRefresh((f) => f + 1);
                  })
                  .catch((err) => {
                    message.error("Xóa bị lỗi!");
                  });
                console.log("DELETE", record);
              }}
              onCancel={() => {}}
              okText="Đồng ý"
              cancelText="Đóng"
            >
              <Button danger type="dashed" icon={<DeleteOutlined />} />
            </Popconfirm>
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => {
                const id = record._id;
                setIdSelect(index+1);
                axiosClient.get("/login/").then((response) => {
                  setAccountLogin(response.data.map((item) => item._id));
                  console.log("Login:", accountLogin);
                  setSelectedRecord(record);
                  console.log("Selected Record", id);
                  updateForm.setFieldsValue(record);
                  setEditFormVisible(true);
                  });             
                
                }}
            />
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    axiosClient.get("/employees").then((response) => {
      setEmployees(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  const onFinish = (values) => {
    axiosClient
      .post("/employees", values)
      .then((response) => {
        message.success("Thêm mới thành công!");
        createForm.resetFields();
        setRefresh((f) => f + 1);
      })
      .catch((err) => {
        message.error("Thêm mới bị lỗi!");
      });
  };
  const onFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  const onUpdateFinish = async (values) => {
    axiosClient
      .patch("/employees/" + selectedRecord._id, values)
      .then((response) => {
                console.log("Select:", accountLogin[idSelect]);
        message.success("Cập nhật thành công!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật bị lỗi!");
      });

    await axiosClient
      .patch("/login/" + accountLogin[idSelect], values)
      .then((response) => {
        console.log("Sửa Login:", accountLogin[idSelect]);
        message.success("Cập nhật thành công!");
        updateForm.resetFields();
        setRefresh((f) => f + 1);
        setEditFormVisible(false);
      })
      .catch((err) => {
        message.error("Cập nhật bị lỗi!");
      });
  };

  const onUpdateFinishFailed = (errors) => {
    console.log("🐣", errors);
  };

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <div>
      <Form
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="on"
      >
        <Form.Item
          label="Họ và tên lót"
          name="lastName"
          rules={[{ required: true, message: "Chưa nhập Họ" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="firstName"
          rules={[{ required: true, message: "Chưa nhập Tên" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Chưa nhập Số điện thoại" }]}
          hasFeedback
        >
          <Input placeholder="Gồm 10 số, bắt đầu bằng 0" />
        </Form.Item>

        <Form.Item
          hasFeedback
          label="Thư điện tử"
          name="email"
          rules={[
            { required: true, message: "Chưa nhập Thư điện tử" },
            { type: "email", message: "Thư điện tử không hợp lệ" },
          ]}
        >
          <Input placeholder="abc@gmail.com" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Chưa nhập Địa chỉ" }]}
          hasFeedback
        >
          <Input placeholder="Số nhà, tên đường, Quận/Huyện, Thành phố/Tỉnh" />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="birthday">
          <Input placeholder="MM/DD/YYYY hoặc YYYY/MM/DD" />
        </Form.Item>
        <Form.Item
          label="Vị trí công việc"
          name="role"
          rules={[{ required: true, message: "Chưa chọn vị trí công việc" }]}
          hasFeedback
        >
          <Select placeholder="Chọn vị trí công việc">
            <Select.Option value="Chăm sóc khách hàng">
              Chăm sóc khách hàng
            </Select.Option>
            <Select.Option value="Giao hàng">Giao hàng</Select.Option>
            <Select.Option value="Quản lý">Quản lý</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Chưa nhập tên đăng nhập" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Chưa nhập mật khẩu" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Thêm nhân viên
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey="_id" dataSource={employees} columns={columns} rowSelection={rowSelection} scroll={{
      y: 400,
    }}/>
      <Modal
        centered
        open={editFormVisible}
        title="Cập nhật thông tin"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setEditFormVisible(false);
        }}
        okText="Lưu thông tin"
        cancelText="Đóng"
      >
        <Form
          form={updateForm}
          name="update-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onUpdateFinish}
          onFinishFailed={onUpdateFinishFailed}
          autoComplete="on"
        >
          <Form.Item
            label="Họ"
            name="firstName"
            rules={[{ required: true, message: "Chưa nhập Họ" }]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên"
            name="lastName"
            rules={[{ required: true, message: "Chưa nhập Tên" }]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: "Chưa nhập Số điện thoại" }]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Thư điện tử"
            name="email"
            rules={[
              { required: true, message: "Chưa nhập Thư điện tử" },
              { type: "email", message: "Thư điện tử không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Chưa nhập Địa chỉ" }]}
            hasFeedback
          >
            <Input />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="birthday">
            <Input />
          </Form.Item>
          <Form.Item
            label="Vị trí công việc"
            name="role"
            rules={[{ required: true, message: "Chưa chọn vị trí công việc" }]}
            hasFeedback
          >
            <Select placeholder="Chọn vị trí công việc" readOnly>
              <Select.Option value="Chăm sóc khách hàng">
                Chăm sóc khách hàng
              </Select.Option>
              <Select.Option value="Giao hàngr">Giao hàng</Select.Option>
              <Select.Option value="Quản lý">Quản lý</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: "Chưa nhập tên đăng nhập" }]}
            hasFeedback
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Chưa nhập mật khẩu" }]}
            hasFeedback
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
