import React from 'react';
import { Table, Button, Form, message, Select } from 'antd';
import { OrderStatus } from '../../../meta/OrderStatus';
import { axiosClient } from '../../../libraries/axiosClient';
import numeral from 'numeral';

export default function SearchOrdersByStatus() {
  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => {
        return (
          <strong>
            {record.customer ? record.customer.fullName : record.customerName}
          </strong>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentType",
      align: "center",
      key: "paymentType",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      key: "status",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerId",
      align: "center",
      key: "customerId",
      render: (text, record) => {
        return <p>{record.customerId ? "Thành viên" : "Vãng lai"}</p>;
      },
    },
    {
      title: "Người tạo đơn",
      dataIndex: "employee",
      align: "center",
      key: "employee",
      render: (text, record) => {
        axiosClient
          .get("/employees/" + record?.employeeLogin?.employeeId)
          .then((response) => {
            setEmployeeName(response.data.fullName);
          });
        return (
          <strong>
            {record?.employeeLogin?.fullName
              ? record.employeeLogin.fullName
              : employeeName}
          </strong>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalProductValue",
      align: "right",
      key: "totalProductValue",
      render: (text, record) => {
        return (
          <strong>{numeral(text + record.shippingFee).format("0,0$")}</strong>
        );
      },
    },
    // {
    //   title: "",
    //   key: "actions",
    //   render: (text, record) => {
    //     const isDisabled =
    //       record.status === "CONFIRMED" ||
    //       record.status === "SHIPPING" ||
    //       record.status === "CANCELED" ||
    //       record.status === "COMPLETED";
    //     const isChanged =
    //       record.status === "CONFIRMED" || record.status === "SHIPPING";
    //     return (
    //       <Space>
    //         {isDisabled ? (
    //           <Button
    //             onClick={() => {
    //               setSelectedOrderView(record);
    //               axiosClient
    //       .get("/employees/" + record?.verifier?.employeeId)
    //       .then((response) => {
    //         setVerifierName(response.data.fullName);
    //       });
    //               setRefresh((f) => f + 1);
    //             }}
    //             icon={<EyeOutlined />}
    //           />
    //         ) : (
    //           <Button
    //             onClick={() => {
    //               setSelectedOrder(record);
    //               setRefresh((f) => f + 1);
    //             }}
    //             icon={<EditOutlined />}
    //             disabled={isDisabled}
    //           />
    //         )}
    //         <Button
    //           type="primary"
    //           ghost
    //           onClick={async (values) => {
    //             if (record.shippingFee === 0 && !record.shipperId) {
    //               message.error(
    //                 "Hãy chọn shipper trước khi xác nhận đơn hàng!"
    //               );
    //             } else {
    //               await axiosClient
    //                 .patch("/orders/" + record._id, { status: "CONFIRMED", verifyId: employeeLoginId })
    //                 .then((response) => {
    //                   message.success("Đơn hàng đã được xác nhận!");
    //                   setRefresh((f) => f + 1);
    //                 });
    //             }
    //           }}
    //           icon={<CheckOutlined />}
    //           disabled={isDisabled}
    //         />
    //         {isChanged ? (
    //           <Popconfirm
    //             style={{ width: 800 }}
    //             title="Are you sure to cancel?"
    //             onConfirm={() => {
    //               setDelectedOrder(record);
    //               // Cancel
    //               const id = record._id;
    //               axiosClient
    //                 .patch("/orders/" + id, { status: "CANCELED" })
    //                 .then((response) => {
    //                   message.success("Đơn hàng đã bị hủy!");
    //                   setRefresh((f) => f + 1);
    //                 })
    //                 .catch((err) => {
    //                   message.error("Hủy bị lỗi!");
    //                 });
    //               console.log("DELETE", record);
    //             }}
    //             onCancel={() => {}}
    //             okText="Đồng ý"
    //             cancelText="Đóng"
    //           >
    //             <Button
    //               danger
    //               type="dashed"
    //               onClick={() => {
    //                 setDelectedOrder(record);
    //                 setRefresh((f) => f + 1);
    //               }}
    //               icon={<CloseOutlined />}
    //             />
    //           </Popconfirm>
    //         ) : (
    //           <Popconfirm
    //             disabled={isDisabled}
    //             style={{ width: 800 }}
    //             title="Are you sure to delete?"
    //             onConfirm={() => {
    //               setDelectedOrder(record);
    //               // DELETE
    //               const id = record._id;
    //               delectedOrder.orderDetails.forEach(async (orderDetail) => {
    //                 const remainQuantity = await axiosClient.get(
    //                   `/products/${orderDetail.productId}/variants/${orderDetail.colorId}/sizes/${orderDetail.sizeId}`
    //                 );
    //                 axiosClient.patch(
    //                   `/products/${orderDetail.productId}/variants/${orderDetail.colorId}/sizes/${orderDetail.sizeId}`,
    //                   {
    //                     quantity:
    //                       remainQuantity.data.quantity + orderDetail.quantity,
    //                   }
    //                 );
    //                 setRefresh((f) => f + 1);
    //               });
    //               axiosClient
    //                 .delete("/orders/" + id)
    //                 .then((response) => {
    //                   message.success("Xóa thành công!");
    //                   setRefresh((f) => f + 1);
    //                 })
    //                 .catch((err) => {
    //                   message.error("Xóa bị lỗi!");
    //                 });
    //               console.log("DELETE", record);
    //             }}
    //             onCancel={() => {}}
    //             okText="Đồng ý"
    //             cancelText="Đóng"
    //           >
    //             <Button
    //               danger
    //               type="dashed"
    //               onClick={() => {
    //                 setDelectedOrder(record);
    //                 setRefresh((f) => f + 1);
    //               }}
    //               icon={<DeleteOutlined />}
    //               disabled={isDisabled}
    //             />
    //           </Popconfirm>
    //         )}
    //       </Space>
    //     );
    //   },
    // },
  ];
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [searchForm] = Form.useForm();
  const [employeeName, setEmployeeName] = React.useState();


  const onFinish = (values) => {
    setLoading(true);
    axiosClient
      .post('/orders/status', values)
      .then((response) => {
        // console.log(response.data);
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error('Lỗi!');
        setLoading(false);
      });
  };

  const onFinishFailed = (errors) => {
    console.log('🐣', errors);
  };

  return (
    <div>
      <Form form={searchForm} name='search-form' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ status: '' }} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete='on'>
        <Form.Item label='Trạng thái đơn hàng' name='status'>
          <Select options={OrderStatus} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit' loading={loading}>
            {loading ? 'Đang xử lý ...' : 'Lọc thông tin'}
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey='_id' dataSource={orders} columns={columns} />
    </div>
  );
}
