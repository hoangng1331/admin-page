import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Table,
  Space,
  Modal,
  Popconfirm,
} from "antd";
import axios from "axios";

const { Option } = Select;

const OrderForm = () => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [sizeID, setSizeID] = useState([]);
  const [index2, setIndex2] = useState(0);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [totalQuantity, setTotalQuantity] = React.useState();
  const [totalValue, setTotalValue] = React.useState();
  const [refresh, setRefresh] = React.useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    // Lấy dữ liệu sản phẩm từ localhost:5000/products
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
      });
  }, []);

  const columns = [
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
        for (let a = 0; a < products.length; a++) {
          if (products[a]._id === record.productId) {
            const color = products[a].color.find((color) => color._id === text);
            return color ? color.name : "";
          }
        }
      },
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeId",
      key: "sizeId",
      width: "auto",
      align: "center",
      render: (text, record, index) => {
        for (let a = 0; a < products.length; a++) {
          if (products[a]._id === record.productId) {
            for (let i = 0; i < products[a].variants.length; i++) {
              if (products[a].variants[i].colorId === record.colorId) {
                const size = products[a].size[i].find((s) => s._id === text);
                if (size) {
                  return size.size;
                }
              }
            }
          }
        }
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
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record, index) => {
        if (index === orderItems.length) {
          // Nếu đây là hàng tổng, trả về chuỗi rỗng
          return "";
        } else {
          return (
            <Space>
              <Button
                onClick={() => {
                  setSelectedRecord(record);
                  console.log("Selected Record", record);
                  updateForm.setFieldsValue(record);
                  setEditFormVisible(true);
                }}
              >
                Chỉnh sửa
              </Button>
              <Button
                onClick={() => {
                  setTotalValue(totalValue - record.totalPrice);
                  setTotalQuantity(totalQuantity - record.quantity);
                  // Nếu tìm thấy sản phẩm trong danh sách, thực hiện xóa sản phẩm
                  const updatedOrderItems = [...orderItems];
                  updatedOrderItems.splice(index, 1); // Xóa sản phẩm khỏi danh sách
                  setOrderItems(updatedOrderItems);
                }}
              >
                Xóa
              </Button>
            </Space>
          );
        }
      },
    },
  ];

  const handleShippingChange = (value) => {
    setShippingFee(value === "inCity" ? 0 : 40000);
  };

  const handleProductChange = (productId) => {
    const product = products.find((p) => p._id === productId);
    // Kiểm tra số lượng sản phẩm có sẵn
    if (product.stock === 0) {
      message.error("Sản phẩm " + product.name + " đã hết hàng");
      // Reset
      setSelectedProduct(null);
      return;
    } else {
      setSelectedProduct(product);
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(1);
    }
  };

  const handleColorChange = (colorId, record) => {
    const color = selectedProduct.variants.find((v) => v.colorId === colorId);
    if (selectedProduct.stockByColor[colorId] === 0) {
      message.error(
        "Màu " +
          record.children[0] +
          " của " +
          selectedProduct.name +
          " đã hết hàng"
      );
      // Reset
      setSelectedColor(null);
      return null;
    } else {
      selectedProduct.variants.find((v, index) => {
        if (v.colorId === colorId) {
          setIndex2(index);
        }
      });
      setSizeID(color.sizes.map((i) => i.sizeId));
      setSelectedColor(color);
      setSelectedSize(null);
      setQuantity(1);
    }
  };
  const handleSizeChange = (sizeId, record) => {
    const size = selectedColor.sizes.find((s) => s.sizeId === sizeId);
    if (record.children[2] === 0) {
      message.error(
        "Màu " +
          selectedProduct.color[index2].name +
          " cỡ " +
          record.children[0] +
          " của " +
          selectedProduct.name +
          " đã hết hàng"
      );
      // Reset
      setSelectedSize(null);
      return;
    }
    setSelectedSize(size);
    setQuantity(1);
  };
  const onUpdateFinish = (values) => {
    const updatedOrderItems = [...orderItems];
    const index = updatedOrderItems.findIndex(
      (item) =>
        item.productId === values.productId &&
        item.colorId === values.colorId &&
        item.sizeId === values.sizeId
    );
    if (index !== -1) {
      // Cập nhật thông tin sản phẩm
      updatedOrderItems[index] = {
        ...updatedOrderItems[index],
        ...values,
        totalPrice:
          values.price * values.quantity * (1 - values.discount / 100),
      };

      // Tính toán lại tổng số lượng và tổng giá trị đơn hàng
      let totalQuantity = 0;
      let totalValue = 0;
      updatedOrderItems.forEach((item) => {
        totalQuantity += item.quantity;
        totalValue += item.totalPrice;
      });

      // Cập nhật lại state và đóng form chỉnh sửa
      setOrderItems(updatedOrderItems);
      setTotalQuantity(totalQuantity);
      setTotalValue(totalValue);
      setEditFormVisible(false);
    }
  };

  const handleAddToOrder = () => {
    if (!selectedProduct || !selectedColor || !selectedSize) {
      message.error("Vui lòng chọn sản phẩm, màu sắc và kích cỡ");
      return;
    }

    if (quantity > selectedSize.quantity) {
      message.error("Số lượng đặt hàng vượt quá số lượng hàng có sẵn");
      return;
    }
    if (quantity === 0) {
      message.error("Hãy nhập số lượng");
      return;
    }

    const existingOrderItem = orderItems.find(
      (item) =>
        item.productId === selectedProduct._id &&
        item.colorId === selectedColor.colorId &&
        item.sizeId === selectedSize.sizeId
    );
    if (existingOrderItem) {
      message.warning("Sản phẩm đã có trong đơn hàng");
      return;
    } else {
      const orderItem = {
        productId: selectedProduct._id,
        colorId: selectedColor.colorId,
        sizeId: selectedSize.sizeId,
        quantity: quantity,
        price: selectedColor.price,
        discount: selectedColor.discount,
        totalPrice:
          (selectedColor.price -
            (selectedColor.price * selectedColor.discount) / 100) *
          quantity,
      };

      setRefresh((f) => f + 1);
      setOrderItems([...orderItems, orderItem]);
      setSelectedProduct(null);
      setSelectedColor(null);
      setSelectedSize(null);
      setQuantity(1);
    }
  };
  const handleFormSubmit = (values) => {
    if (orderItems.length === 0) {
      message.error("Chưa có sản phẩm nào trong đơn hàng");
    } else {
      axios
        .post("http://localhost:5000/orders", {
          customerName: values.customerName,
          phoneNumber: values.phoneNumber,
          email: values.email,
          address: values.address,
          orderDetails: orderItems,
          totalQuantity: totalQuantity,
          totalValue: totalValue,
          shippingFee: shippingFee,
        })
        .then((response) => {
          console.log(response);
          message.success("Đã tạo đơn hàng thành công!");
          // Xóa toàn bộ record trong bảng
          setOrderItems([]);
          setSelectedProduct(null);
          setSelectedColor(null);
          setSelectedSize(null);
          setQuantity(1);
          // Reset lại các trường trong form
          form.resetFields();
          createForm.resetFields();
          setRefresh((f) => f + 1);
        })
        .catch((err) => {
          message.error("Vui lòng nhập đầy đủ thông tin cần thiết!");
        });
    }
  };
  useEffect(() => {
    const getTotal = orderItems.map((i) => Number(i.totalPrice));
    const totalValue = getTotal.reduce(
      (accumulator, item) => accumulator + item,
      0
    );
    setTotalValue(totalValue);

    const getTotalQuantity = orderItems.map((i) => Number(i.quantity));
    const totalQuantity = getTotalQuantity.reduce(
      (accumulator, item) => accumulator + item,
      0
    );
    setTotalQuantity(totalQuantity);
  }, [refresh]);

  return (
    <div>
      <h2>Thông tin người mua hàng:</h2>
      <Form
        form={createForm}
        name="create-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleFormSubmit}
        autoComplete="on"
      >
        <Form.Item
          name="customerName"
          label="Tên khách hàng"
          rules={[{ required: true, message: "Chưa nhập tên khách hàng" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Số điện thoại"
          rules={[{ required: true, message: "Chưa nhập số điện thoại" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Vui lòng nhập đúng định dạng email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="paymenType"
          label="Phương thức thanh toán"
          rules={[{ required: true }]}
        >
          <Select showSearch optionFilterProp="children">
            <Option value="CASH">Tiền mặt</Option>
            <Option value="CREDIT CARD">Thẻ tín dụng</Option>
            <Option value="BANK TRANSFER">Chuyển khoản ngân hàng</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Chưa nhập địa chỉ" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input />
        </Form.Item>
        <Form.Item label="Phí ship">
          <Select
            defaultValue="inCity"
            onChange={handleShippingChange}
            showSearch
            optionFilterProp="children"
          >
            <Select.Option value="inCity">Nội thành</Select.Option>
            <Select.Option value="outCity">
              Ngoại thành (+40,000đ)
            </Select.Option>
          </Select>
        </Form.Item>
        <h2>Chọn sản phẩm để thêm vào đơn hàng:</h2>
        <Form.Item label="Sản phẩm">
          <Select
            value={selectedProduct ? selectedProduct._id : undefined}
            onChange={handleProductChange}
            showSearch
            optionFilterProp="children"
          >
            {products.map((product) => (
              <Option key={product._id} value={product._id}>
                {product.name} - Tồn kho: {product.stock}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {selectedProduct && (
          <>
            <Form.Item label="Màu sắc">
              <Select
                value={selectedColor ? selectedColor.colorId : undefined}
                onChange={handleColorChange}
                showSearch
                optionFilterProp="children"
              >
                {selectedProduct.variants.map((variant, index) => (
                  <Option key={variant.colorId} value={variant.colorId}>
                    {selectedProduct.color[index].name} - Tồn kho:{" "}
                    {selectedProduct.stockByColor[variant.colorId]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectedColor && (
              <>
                <Form.Item label="Kích cỡ">
                  <Select
                    value={selectedSize ? selectedSize.sizeId : undefined}
                    onChange={handleSizeChange}
                  >
                    {selectedProduct?.size[index2].map((size, index) => {
                      return (
                        <Option key={size._id} value={size._id}>
                          {size.size} - Tồn kho:{" "}
                          {selectedColor?.sizes[index]?.quantity}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                {selectedSize && (
                  <>
                    <Form.Item label="Số lượng">
                      <Input
                        type="number"
                        min={1}
                        max={selectedSize.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                      />
                    </Form.Item>
                  </>
                )}
              </>
            )}
          </>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleAddToOrder}>Thêm vào đơn hàng</Button>
        </div>
        <h1>Danh sách sản phẩm trong đơn hàng:</h1>
        {orderItems.length > 0 ? (
          <Table
            columns={columns}
            dataSource={orderItems}
            rowKey={(_, record, index) => index}
            pagination={false}
            scroll={{
              y: 300,
            }}
            summary={() => {
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
                      <strong>{totalValue}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row align="right">
                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <strong>Phí vận chuyển:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <strong>{shippingFee}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                  </Table.Summary.Row>
                  <Table.Summary.Row align="right">
                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    <Table.Summary.Cell index={2}></Table.Summary.Cell>
                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                    <Table.Summary.Cell index={5}>
                      <strong>Tổng cộng:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6}>
                      <strong>{totalValue + shippingFee}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7}></Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        ) : (
          <p>Chưa có sản phẩm trong đơn hàng</p>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo đơn đặt hàng
          </Button>
        </Form.Item>
      </Form>
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
          autoComplete="on"
        >
         <Form.Item label="Sản phẩm">
          <Select
            value={selectedProduct ? selectedProduct._id : undefined}
            onChange={handleProductChange}
            showSearch
            optionFilterProp="children"
          >
            {products.map((product) => (
              <Option key={product._id} value={product._id}>
                {product.name} - Tồn kho: {product.stock}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {selectedProduct && (
          <>
            <Form.Item label="Màu sắc">
              <Select
                value={selectedColor ? selectedColor.colorId : undefined}
                onChange={handleColorChange}
                showSearch
                optionFilterProp="children"
              >
                {selectedProduct.variants.map((variant, index) => (
                  <Option key={variant.colorId} value={variant.colorId}>
                    {selectedProduct.color[index].name} - Tồn kho:{" "}
                    {selectedProduct.stockByColor[variant.colorId]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectedColor && (
              <>
                <Form.Item label="Kích cỡ">
                  <Select
                    value={selectedSize ? selectedSize.sizeId : undefined}
                    onChange={handleSizeChange}
                  >
                    {selectedProduct?.size[index2].map((size, index) => {
                      return (
                        <Option key={size._id} value={size._id}>
                          {size.size} - Tồn kho:{" "}
                          {selectedColor?.sizes[index]?.quantity}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                {selectedSize && (
                  <>
                    <Form.Item label="Số lượng">
                      <Input
                        type="number"
                        min={1}
                        max={selectedSize.quantity}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                      />
                    </Form.Item>
                  </>
                )}
              </>
            )}
          </>
        )}
        </Form>
      </Modal>
    </div>
  );
};
export default OrderForm;
