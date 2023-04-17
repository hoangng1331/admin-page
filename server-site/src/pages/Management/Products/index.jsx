import React from "react";
import {
  Image,
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  message,
  Space,
  Modal,
  Select,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import { axiosClient } from "../../../libraries/axiosClient";
import moment from "moment";
import numeral from "numeral";
import { API_URL } from "../../../constants/URLS";

export default function Products() {
  const [isPreview, setIsPreview] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [colors, setColors] = React.useState([]);
  const [sizes, setSizes] = React.useState([]);
  const columns = [
    {
      title: "Hình ảnh",
      key: "imageUrl",
      dataIndex: "imageUrl",
      width: "1%",
      render: (text, record) => {
        return (
          <div>
            {text && (
              <React.Fragment>
                <Image
                  onClick={() => {
                    setSelectedRecord(record);
                    setIsPreview(true);
                  }}
                  preview={{
                    visible: false,
                  }}
                  width={60}
                  src={`${API_URL}${text}`}
                />
                <div
                  style={{
                    display: "none",
                  }}
                >
                  <Image.PreviewGroup
                    preview={{
                      visible: isPreview && record._id === selectedRecord?._id,
                      onVisibleChange: (vis) => setIsPreview(vis),
                    }}
                  >
                    <Image src={`${API_URL}${text}`} />
                    {record &&
                      record.images &&
                      record.images.map((image) => {
                        return <Image key={image} src={`${API_URL}${image}`} />;
                      })}
                  </Image.PreviewGroup>
                </div>
              </React.Fragment>
            )}
          </div>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (text, record) => {
        return <strong>{record?.category?.name}</strong>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: 'Chi tiết',
      dataIndex: 'variants',
      key: 'details',
      render: (variants, record) => (
        <ul>
          {variants.map((color, index) => (
            <li key={index}>
             <strong> Màu: {record?.color[index].name} - Giá bán: {numeral(color.price).format("0,0$")} - Giảm giá: {numeral(color.discount).format("0,0.0")}%</strong>
              <ul>
                {color.sizes.map((size, i) => (
                  <li key={i}>
                    Cỡ: {record?.size[index][i].size} - Số lượng: {size.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )
    },
   
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (text) => {
        return <span>{numeral(text).format("0,0.0")}</span>;
      },
    },
    {
      title: "Hình chi tiết",
      dataIndex: "images",
      key: "images",
      render: (text, record) => {
        if (record.images) {
          return (
            <Button
              onClick={() => {
                console.log("selectedRecord", record);
              }}
            >
              Xem
            </Button>
          );
        }
        return <React.Fragment></React.Fragment>;
      },
    },
    {
      title: "",
      key: "actions",
      width: "1%",
      render: (text, record) => {
        return (
          <Space>
            <Popconfirm
              style={{ width: 800 }}
              title="Are you sure to delete?"
              onConfirm={() => {
                // DELETE
                const id = record._id;
                axiosClient
                  .delete("/products/" + id)
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
                setSelectedRecord(record);
                console.log("Selected Record", record);
                updateForm.setFieldsValue(record);
                setEditFormVisible(true);
              }}
            />
            <Upload
              showUploadList={false}
              name="file"
              action={API_URL + "/upload/products/" + record._id}
              headers={{ authorization: "authorization-text" }}
              onChange={(info) => {
                if (info.file.status !== "uploading") {
                  console.log(info.file, info.fileList);
                }

                if (info.file.status === "done") {
                  message.success(
                    `${info.file.name} file uploaded successfully`
                  );

                  setRefresh((f) => f + 1);
                } else if (info.file.status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <Button icon={<UploadOutlined />} />
            </Upload>
          </Space>
        );
      },
    },
  ];
  

  const fetchColors = async () => {
    try {
      const response = await axiosClient.get("/colors"); // Thay đổi đường dẫn API tương ứng
      setColors(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    axiosClient.get("/sizes").then((response) => {
      setSizes(response.data);
    });
    axiosClient.get("/categories").then((response) => {
      setCategories(response.data);
    });
    fetchColors();
  }, []);

  React.useEffect(() => {
    axiosClient.get("/products").then((response) => {
      setProducts(response.data);
      console.log(response.data);
    });
  }, [refresh]);

  const onFinish = (values) => {
    console.log(values);
    axiosClient
      .post("/products", values)
      .then((response) => {
        // UPLOAD FILE
        const { _id } = response.data;

        const formData = new FormData();
        formData.append("file", file);

        axiosClient
          .post(API_URL + "/upload/products/" + _id, formData)
          .then((respose) => {
            message.success("Thêm mới thành công!");
            createForm.resetFields();
            setRefresh((f) => f + 1);
          })
          .catch((err) => {
            message.error("Upload file bị lỗi!");
          });
      })
      .catch((err) => {
        console.log(err)
        message.error("Thêm mới bị lỗi!");
      });
  };
  const onFinishFailed = (errors, response, values) => {
    console.log("🐣", errors.values);
  };

  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/products/" + selectedRecord._id, values)
      .then((response) => {
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
          label="Danh mục sản phẩm"
          name="categoryId"
          rules={[{ required: true, message: "Hãy chọn loại sản phẩm!" }]}
          hasFeedback
        >
          <Select
            options={
              categories &&
              categories.map((c) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Hãy nhập tên sản phẩm!" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả sản phẩm"
          name="description"
          rules={[{ required: true, message: "Hãy nhập mô tả sản phẩm!" }]}
          hasFeedback
        >
          <Input.TextArea />
        </Form.Item>
        <Form.List name="variants">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div key={field.key}>
                  <Form.Item
                    label="Màu"
                    name={[field.name, "colorId"]}
                    fieldKey={[field.fieldKey, "colorId"]}
                    rules={[{ required: true, message: "Hãy chọn một màu!" }]}
                  >
                     <Select
                        options={
                          colors &&
                          colors.map((c) => {
                            return {
                              value: c._id,
                              label: c.name,
                            };
                          })
                        }
                      />
                  </Form.Item>
                  <Form.Item
                    label="Price"
                    name={[field.name, "price"]}
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập giá bán!",
                      },
                    ]}
                    fieldKey={[field.fieldKey, "price"]}
                  >
                    <Input type="number" min={0} style={{ width: 150 }} />
                  </Form.Item>
                  <Form.Item
                    label="Discount"
                    name={[field.name, "discount"]}
                    fieldKey={[field.fieldKey, "discount"]}
                  >
                    <Input
                      type="number"
                      step={0.01}
                      min={0}
                      max={100}
                      style={{ width: 100 }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Kích cỡ và số lượng"
                    name={[field.name, "sizes"]}
                    fieldKey={[field.fieldKey, "sizes"]}
                  >
                    <Form.List name={[field.name, "sizes"]}>
                      {(sizeFields, { add: addSize, remove: removeSize }) => (
                        <>
                          {sizeFields.map((sizeField) => (
                            <div key={sizeField.key}>
                              <Form.Item
                                label="Size"
                                name={[sizeField.name, "sizeId"]}
                                fieldKey={[sizeField.fieldKey, "sizeId"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Hãy chọn một kích cỡ!",
                                  },
                                ]}
                              >
                                <Select
                                    style={{ width: 150 }}
                                    options={
                                      sizes &&
                                      sizes.map((c) => {
                                        return {
                                          value: c._id,
                                          label: c.size,
                                        };
                                      })
                                    }
                                  />
                              </Form.Item>
                              <Form.Item
                                label="Quantity"
                                name={[sizeField.name, "quantity"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Hãy nhập số lượng!",
                                  },
                                ]}
                                fieldKey={[sizeField.fieldKey, "quantity"]}
                              >
                                <Input
                                  type="number"
                                  min={0}
                                  style={{ width: 100 }}
                                />
                              </Form.Item>
                              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                  onClick={() => removeSize(sizeField.name)}
                                  icon={<DeleteOutlined />}
                                >
                                  Xóa kích cỡ
                                </Button>
                              </Form.Item>
                            </div>
                          ))}
                          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                              onClick={() => addSize()}
                              icon={<PlusCircleOutlined />}
                            >
                              Thêm kích cỡ
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                      onClick={() => remove(field.name)}
                      icon={<DeleteOutlined />}
                    >
                      Xóa màu
                    </Button>
                  </Form.Item>
                </div>
              ))}
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button onClick={() => add()} icon={<PlusCircleOutlined />}>
                  Thêm màu
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item label="Hình minh họa" name="file">
          <Upload
            showUploadList={true}
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" block>
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
      <Table
        rowKey="_id"
        dataSource={products}
        columns={columns}
        pagination={false}
        scroll={{
          y: 400,
        }}
      />
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
          label="Danh mục sản phẩm"
          name="categoryId"
          rules={[{ required: true, message: "Hãy chọn loại sản phẩm!" }]}
          hasFeedback
        >
          <Select
            options={
              categories &&
              categories.map((c) => {
                return {
                  value: c._id,
                  label: c.name,
                };
              })
            }
          />
        </Form.Item>

        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Hãy nhập tên sản phẩm!" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả sản phẩm"
          name="description"
          rules={[{ required: true, message: "Hãy nhập mô tả sản phẩm!" }]}
          hasFeedback
        >
          <Input.TextArea />
        </Form.Item>
        <Form.List name="variants">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div key={field.key}>
                  <Form.Item
                    label="Màu"
                    name={[field.name, "colorId"]}
                    fieldKey={[field.fieldKey, "colorId"]}
                    rules={[{ required: true, message: "Hãy chọn một màu!" }]}
                  >
                     <Select
                        options={
                          colors &&
                          colors.map((c) => {
                            return {
                              value: c._id,
                              label: c.name,
                            };
                          })
                        }
                      />
                  </Form.Item>
                  <Form.Item
                    label="Price"
                    name={[field.name, "price"]}
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập giá bán!",
                      },
                    ]}
                    fieldKey={[field.fieldKey, "price"]}
                  >
                    <Input type="number" min={0} style={{ width: 150 }} />
                  </Form.Item>
                  <Form.Item
                    label="Discount"
                    name={[field.name, "discount"]}
                    fieldKey={[field.fieldKey, "discount"]}
                  >
                    <Input
                      type="number"
                      step={0.01}
                      min={0}
                      max={100}
                      style={{ width: 100 }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Kích cỡ và số lượng"
                    name={[field.name, "sizes"]}
                    fieldKey={[field.fieldKey, "sizes"]}
                  >
                    <Form.List name={[field.name, "sizes"]}>
                      {(sizeFields, { add: addSize, remove: removeSize }) => (
                        <>
                          {sizeFields.map((sizeField) => (
                            <div key={sizeField.key}>
                              <Form.Item
                                label="Size"
                                name={[sizeField.name, "sizeId"]}
                                fieldKey={[sizeField.fieldKey, "sizeId"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Hãy chọn một kích cỡ!",
                                  },
                                ]}
                              >
                                <Select
                                    style={{ width: 150 }}
                                    options={
                                      sizes &&
                                      sizes.map((c) => {
                                        return {
                                          value: c._id,
                                          label: c.size,
                                        };
                                      })
                                    }
                                  />
                              </Form.Item>
                              <Form.Item
                                label="Quantity"
                                name={[sizeField.name, "quantity"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Hãy nhập số lượng!",
                                  },
                                ]}
                                fieldKey={[sizeField.fieldKey, "quantity"]}
                              >
                                <Input
                                  type="number"
                                  min={0}
                                  style={{ width: 100 }}
                                />
                              </Form.Item>
                              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                  onClick={() => removeSize(sizeField.name)}
                                  icon={<DeleteOutlined />}
                                >
                                  Xóa kích cỡ
                                </Button>
                              </Form.Item>
                            </div>
                          ))}
                          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button
                              onClick={() => addSize()}
                              icon={<PlusCircleOutlined />}
                            >
                              Thêm kích cỡ
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                      onClick={() => remove(field.name)}
                      icon={<DeleteOutlined />}
                    >
                      Xóa màu
                    </Button>
                  </Form.Item>
                </div>
              ))}
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button onClick={() => add()} icon={<PlusCircleOutlined />}>
                  Thêm màu
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item label="Hình minh họa" name="file">
          <Upload
            showUploadList={true}
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
