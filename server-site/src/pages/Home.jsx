// import React from "react";
// import axios from "axios";
// import {Form, Button, Select, Input, InputNumber, Table, Space, Modal } from "antd";
// import {Navigate} from "react-router-dom"

// export default function Home () {
//   const [refresh, setRefresh] = React.useState(0)
//   const [products, setProducts] = React.useState([]);
//   const [changeModal, setChangeModal] = React.useState(false);
//   const [saveChange, setSaveChange] = React.useState(null);
  
//    // const [createForm] = Form.useForm;
//   const columns = [
//     {
//       title: 'STT', 
//       width: '1%',
//       render: (text, record, index) => {
//         return (
//           <div style = {{textAlign: 'right'}}>
//             <span>{index+1}</span>
//           </div>
//         )
//       },
//       key: 'number',
//     },
//     {
//       title: 'Mã',
//       dataIndex: '_id',
//       key: 'id',
//       width: '1%',
//       align: 'center'
//     },
//     {
//       title: 'Loại sản phẩm',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Tùy chọn',
//       key: 'action',
//       render: (text, record, index)=>{
//           return (<Space>
//             <Button onClick={() => changeData(record)}>Sửa</Button> 
//             <Button onClick={() => deleteData(record._id)}>Xóa</Button></Space>)
//       }
//     },  
//   ]
//     React.useEffect(() => {
//         axios.get('http://localhost:5000/categories').then((response)=>
//         setProducts(response.data));
//     }, [refresh]);
//     const onFinish = (values: any) => {
//       console.log('Success:', values);
//       axios.post('http://localhost:5000/categories', values).then((response)=>{
        
//       setRefresh((f)=> f + 1)
//       createForm.resetFields();
//       console.log(response.data)
//       })
//     };
//     const onChange = (values) => {
//       console.log('Success:', values);
//       axios.patch('http://localhost:5000/categories/'+saveChange._id, values).then((response)=>{
//       setRefresh((f)=> f + 1)
//       updateForm.resetFields();
//       setChangeModal(false)
//       console.log(response.data)
//       })
//     };
//     const [createForm] = Form.useForm();
//     const [updateForm] = Form.useForm();
//     const onFinishFailed = (errorInfo: any) => {
//       console.log('Failed:', errorInfo);
//     };
//     const changeData =(data)=>{
//       setChangeModal(true);
//       setSaveChange(data)
//       updateForm.setFieldsValue(data)
//     }
//     const deleteData =(_id)=>{
//       axios.delete('http://localhost:5000/categories/'+ _id).then((response)=>{
//         console.log(response);
//         setRefresh((f)=> f + 1);
//       })
//         }
//     return <div>
//         <Form
//     form={createForm}
//     name="Create-product"
//     labelCol={{ span: 8 }}
//     wrapperCol={{ span: 16 }}
//     style={{ maxWidth: 600 }}
//     onFinish={onFinish}
//     onFinishFailed={onFinishFailed}
//     autoComplete="off"
//     >
//       <Form.Item
//       label="Loại sản phẩm"
//       name="name"
//       rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
//     >
//       <Input />
//     </Form.Item>
//         <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//       <Button type="primary" htmlType="submit">
//         Thêm
//       </Button>
//     </Form.Item>
//       </Form>
//        <Table rowKey='_id' dataSource={products} columns = {columns} pagination={false}/>
//        <Modal open={changeModal}
//        title='Cập nhật thông tin sản phẩm'
//        onCancel={()=> setChangeModal(false)}
//        cancelText='Hủy bỏ'
//        okText='Cập nhật'
//        onOk={()=>{
//         updateForm.submit();
//        }}>
//        <Form
//     form={updateForm}
//     name="Update-product"
//     labelCol={{ span: 8 }}
//     wrapperCol={{ span: 16 }}
//     style={{ maxWidth: 600 }}
//     onFinish={onChange}
//     onFinishFailed={onFinishFailed}
//     autoComplete="off"
//     >
//        <Form.Item
//       label="Loại sản phẩm"
//       name="name"
//       rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
//     >
//       <Input />
//     </Form.Item>
//       </Form>
//          </Modal>
//     </div>
// }
import React, { useState } from "react";
import { DatePicker, Button, Table } from "antd";
import moment from "moment";
// import "antd/dist/antd.css";
import "moment/locale/vi";

const Home = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);

  const handleDateChange = (date, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  const handleGenerateReport = () => {
    // Gọi API hoặc xử lý logic để lấy dữ liệu báo cáo bán hàng từ startDate đến endDate
    // Lưu dữ liệu báo cáo vào state reportData
    const salesReportData = [
      { date: "2023-04-01", totalSales: 1500, totalOrders: 25 },
      { date: "2023-04-02", totalSales: 2500, totalOrders: 35 },
      { date: "2023-04-03", totalSales: 3000, totalOrders: 40 },
      { date: "2023-04-04", totalSales: 2000, totalOrders: 30 },
    ];
    setReportData(salesReportData);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
    },
    {
      title: "Total Orders",
      dataIndex: "totalOrders",
      key: "totalOrders",
    },
  ];

  return (
    <div>
      <h1>Sales Report</h1>
      <DatePicker.RangePicker onChange={handleDateChange} />
      <Button type="primary" onClick={handleGenerateReport} style={{ marginLeft: 16 }}>
        Generate Report
      </Button>
      {reportData.length > 0 ? (
        <Table dataSource={reportData} columns={columns} />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default Home;
