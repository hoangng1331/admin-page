import React from "react";
import {
  Table,
  Button,
  Card,
  Modal,
  Descriptions,
  Divider,
  Form,
  Space,
  message,
  Popconfirm,
  Select,
  InputNumber,
  Input,
  Checkbox,
} from "antd";
import { axiosClient } from "../../../libraries/axiosClient";
import numeral from "numeral";
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../../hooks/useAuthStore";
const { Option } = Select;
export default function ConfirmedOrders() {
  const [addProductsModalVisible, setAddProductsModalVisible] =
    React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [selectedOrderView, setSelectedOrderView] = React.useState(null);
  const [delectedOrder, setDelectedOrder] = React.useState(null);
  const [employeeName, setEmployeeName] = React.useState();
  const [verifierName, setVerifierName] = React.useState();
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedColor, setSelectedColor] = React.useState(null);
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [appeared, setAppeared] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [maxQuantity, setMaxQuantity] = React.useState(0);
  const [index2, setIndex2] = React.useState(0);
  const [selectEditRecord, setSelectEditRecord] = React.useState(null);
  const [sizeID, setSizeID] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [orderDetail, setOrderDetail] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const { auth, logout } = useAuthStore((state) => state);
  const [employeeLoginId, setEmployeeLoginId] = React.useState("");
  React.useEffect(
    (e) => {
      if (auth) {
        axiosClient
          .get("/login/" + auth?.loggedInUser?._id)
          .then((response) => {
            setEmployeeLoginId(response.data._id);
          });
      }
    },
    [refresh]
  );
  // Products
  const [products, setProducts] = React.useState([]);
 
  const productColumnsView = [
    {
      title: "Sản phẩm",
      dataIndex: "productId",
      key: "productId",
      align: "left",
      width: "auto",
      render: (text, record) => {
        const product = products.find((p) => p._id === text);
        return product ? product.name : "";
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "colorId",
      key: "colorId",
      width: "auto",
      align: "center",
      render: (text, record, index) => {
        const product = products.find(
          (product) => product._id === record.productId
        );
        const color = product?.color.find((color) => color._id === text);
        const hexcode = product?.color.find(
          (color) => color._id === record.colorId
        )?.hexcode[0].hex;
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                backgroundColor: hexcode,
                display: "inline-block",
                width: "20px",
                height: "20px",
              }}
            ></span>
            <span style={{ marginLeft: "8px" }}>{color?.name || ""}</span>
          </div>
        );
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeId",
      key: "sizeId",
      width: "auto",
      align: "center",
      render: (text, record, index) => {
        const product = products.find(
          (product) => product._id === record.productId
        );
        const variant = product?.variants.findIndex(
          (variant) => variant.colorId === record.colorId
        );
        const size = product.size[variant]?.find((s) => s._id === text)?.size;
        return size || "";
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "10%",
      align: "right",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (text, record) => {
        return <p>{numeral(text).format("0,0$")}</p>;
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      align: "center",
    },
    {
      title: "Tổng giá",
      dataIndex: "totalPrice",
      align: "right",
      key: "totalPrice",
      render: (text, record) => {
        return <strong>{numeral(text).format("0,0$")}</strong>;
      },
    },
  ];
  // Orders
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
    {
      title: "",
      key: "actions",
      render: (text, record) => {
        return (
          <Space>
              <Button
                onClick={() => {
                  setSelectedOrderView(record);
                  axiosClient
          .get("/employees/" + record?.verifier?.employeeId)
          .then((response) => {
            setVerifierName(response.data.fullName);
          });
                  setRefresh((f) => f + 1);
                }}
                icon={<EyeOutlined />}
              />
            <Button
              type="primary"
              ghost
              onClick={async (values) => {
                  await axiosClient
                    .patch("/orders/" + record._id, {status: "Shipping"})
                    .then((response) => {
                      message.success("Đã lấy hàng!");
                      setRefresh((f) => f + 1);
                    });
                }
              }
              icon={<CheckOutlined />}
            />
          </Space>
        );
      },
    },
  ];
  React.useEffect(() => {
    axiosClient.post("/orders/status", {status: "Confirmed"}).then((response) => {
      setOrders(response.data);
    });
    axiosClient
      .get(`/orders/${selectedOrder?._id}/orderDetails`)
      .then((response) => {
        setOrderDetail(response.data);
      });
    axiosClient
      .get(`/orders/${selectedOrderView?._id}/orderDetails`)
      .then((response) => {
        setOrderDetail(response.data);
      });
    axiosClient.get("/products").then((response) => {
      setProducts(response.data);
    });
    axiosClient
      .get(
        `/products/${selectEditRecord?.productId}/variants/${selectEditRecord?.colorId}/sizes/${selectEditRecord?.sizeId}`
      )
      .then((response) => {
        setMaxQuantity(response.data.quantity);
      });
    async function fetchEmployees() {
      try {
        const response = await axiosClient.get("/employees");
        const filteredEmployees = response.data.filter(
          (employee) => employee.role === "Giao hàng"
        );
        setEmployees(filteredEmployees);
      } catch (error) {
        console.log(error);
      }
    }

    fetchEmployees();
  }, [refresh]);
  
  return (
    <div>
      <Table rowKey="_id" dataSource={orders} columns={columns} />

      <Modal
        centered
        width={"90%"}
        title="Chi tiết đơn hàng"
        open={selectedOrderView}
        onOk={() => setSelectedOrderView(null)}
        onCancel={() => {
          setSelectedOrderView(null);
        }}
      >
        {selectedOrderView && (
          <div>
            <Descriptions
              bordered
              column={2}
              labelStyle={{ fontWeight: "700" }}
            >
              <Descriptions.Item label="Trạng thái">
                {selectedOrderView.status}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">
                {selectedOrderView.customer
                  ? selectedOrderView.customer.fullName
                  : selectedOrderView.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ giao hàng">
                {selectedOrderView.address}
              </Descriptions.Item>
              <Descriptions.Item label="Khu vực giao hàng">
                {selectedOrderView.deliveryArea}
              </Descriptions.Item>
              {selectedOrderView.shippingFee === 0 ? (
                <Descriptions.Item label="Nhân viên giao hàng">
                  {selectedOrderView.shipper.fullName}
                </Descriptions.Item>
              ) : (
                <Descriptions.Item label="Phí vận chuyển">
                  {numeral(selectedOrderView.shippingFee).format("0,0$")}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Trạng thái thanh toán">
                {selectedOrderView.paymentStatus}
              </Descriptions.Item>
              {selectedOrderView.note ? (
                <Descriptions.Item label="Ghi chú">
                  {selectedOrderView.note}
                </Descriptions.Item>
              ) : (
                <></>
              )}
              <Descriptions.Item label="Người xác nhận đơn">
                  {selectedOrderView.verifier.fullName??verifierName}
                </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Table
              rowKey="_id"
              dataSource={orderDetail}
              columns={productColumnsView}
              scroll={{
                y: 300,
              }}
              summary={(pageData) => {
                let totalQuantity = 0;
                let totalValue = 0;
                pageData.forEach(({ quantity, totalPrice }) => {
                  totalQuantity += quantity;
                  totalValue += totalPrice;
                });
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row align="right">
                      <Table.Summary.Cell index={0}></Table.Summary.Cell>
                      <Table.Summary.Cell index={1}></Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        <strong>Tổng sản phẩm:</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        <strong>{totalQuantity}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4}></Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        <strong>Tổng giá trị:</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>
                        <strong>{numeral(totalValue).format("0,0$")}</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}