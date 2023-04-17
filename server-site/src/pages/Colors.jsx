import React from "react";
import axios from "axios";
import {Form, Button, Select, Input, InputNumber, Table, Space, Modal } from "antd";
import {Navigate} from "react-router-dom"

export default function Home () {
  const [refresh, setRefresh] = React.useState(0)
  const [colors, setColors] = React.useState([]);
  const [changeModal, setChangeModal] = React.useState(false);
  const [saveChange, setSaveChange] = React.useState(null);
  
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
      title: 'Mã màu',
      dataIndex: 'hexcode',
      key: 'id',
      width: '1%',
      align: 'center'
    },
    {
      title: 'Tên màu',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tùy chọn',
      key: 'action',
      render: (text, record, index)=>{
          return (<Space>
            <Button onClick={() => changeData(record)}>Sửa</Button> 
            <Button onClick={() => deleteData(record._id)}>Xóa</Button></Space>)
      }
    },  
  ]
    React.useEffect(() => {
        axios.get('http://localhost:5000/colors').then((response)=>
        setColors(response.data));
    }, [refresh]);
    const onFinish = (values: any) => {
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
    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    const changeData =(data)=>{
      setChangeModal(true);
      setSaveChange(data)
      updateForm.setFieldsValue(data)
    }
    const deleteData =(_id)=>{
      axios.delete('http://localhost:5000/colors/'+ _id).then((response)=>{
        console.log(response);
        setRefresh((f)=> f + 1);
      })
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
      <Input />
    </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Thêm
      </Button>
    </Form.Item>
      </Form>
       <Table rowKey='_id' dataSource={colors} columns = {columns} pagination={false}/>
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
      <Input />
    </Form.Item>
      </Form>
         </Modal>
    </div>
}
