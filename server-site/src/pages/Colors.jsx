import React from "react";
import axios from "axios";
import {Form, Button, Input,  Table, Space, Modal } from "antd";
import { ChromePicker } from "react-color";


export default function ColorForm () {
  const [refresh, setRefresh] = React.useState(0)
  const [colors, setColors] = React.useState([]);
  const [changeModal, setChangeModal] = React.useState(false);
  const [saveChange, setSaveChange] = React.useState(null);
  const [color, setColor] = React.useState("#ffffff");
   // const [createForm] = Form.useForm;
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
      title: 'Tên màu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hexcode',
      dataIndex: 'hex',
      key: 'hex',
      render: (text, record) => (
        <span>
          {record.hexcode[0].hex}
        </span>
      ),
    },
    {
      title: 'Xem trước',
      dataIndex: 'preview',
      key: 'preview',
      render: (text, record) => (
        <span style={{ backgroundColor: record.hexcode[0].hex, display: 'inline-block', width: '30px', height: '30px' }}></span>
      ),
    },
    {
      key: 'action',
      render: (text, record, index)=>{
          return (
            <Button onClick={() => changeData(record)}>Sửa</Button> 
          )
      }
    },  
  ]
    React.useEffect(() => {
        axios.get('http://localhost:5000/colors').then((response)=>
        setColors(response.data));
    }, [refresh]);
    const onFinish = (values) => {
      console.log('Success:', values);
      axios.post('http://localhost:5000/colors', values).then((response)=>{
        
      setRefresh((f)=> f + 1)
      createForm.resetFields();
      console.log(response.data)
      })
    };
    const onChange = (values) => {
      console.log('Success:', values);
      axios.patch('http://localhost:5000/colors/'+saveChange._id, values).then((response)=>{
      setRefresh((f)=> f + 1)
      updateForm.resetFields();
      setChangeModal(false)
      console.log(response.data)
      })
    };
    const handleColorChange = (newColor) => {
      setColor(newColor.hex); // lưu giá trị màu khi thay đổi vào state
    }
    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    const changeData =(data)=>{
      setChangeModal(true);
      setSaveChange(data)
      updateForm.setFieldsValue(data)
    }
    return <div>
        <Form
    form={createForm}
    name="Create-color"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    >
      <Form.Item
      label="Tên màu"
      name="name"
      rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Mã màu"
      name="hexcode"
      rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
    >
      <ChromePicker color={color} onChange={handleColorChange} />
    </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Thêm
      </Button>
    </Form.Item>
      </Form>
       <Table rowKey='_id' dataSource={colors.map((item) => ({ ...item, key: item._id }))} columns = {columns} pagination={false} scroll={{ y: "200px"}}/>
       <Modal open={changeModal}
       title='Cập nhật thông tin sản phẩm'
       onCancel={()=> setChangeModal(false)}
       cancelText='Hủy bỏ'
       okText='Cập nhật'
       onOk={()=>{
        updateForm.submit();
       }}>
       <Form
    form={updateForm}
    name="Update-color"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    onFinish={onChange}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    >
      <Form.Item
      label="Tên màu"
      name="name"
      rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Mã màu"
      name="hexcode"
      rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
    >
      <ChromePicker color={color} onChange={handleColorChange} />
    </Form.Item>
      </Form>
         </Modal>
    </div>
}
