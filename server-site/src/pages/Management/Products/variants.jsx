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
  Descriptions,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  LikeFilled,
} from "@ant-design/icons";
import { useAuthStore } from "../../../hooks/useAuthStore";
import { axiosClient } from "../../../libraries/axiosClient";
import numeral from "numeral";
import { API_URL } from "../../../constants/URLS";
import ColorForm from "../../Colors";
import axios from "axios";
export default function Variants() {
  const [isPreview, setIsPreview] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  const [editFormVisible, setEditFormVisible] = React.useState(false);
  const [fileList, setFileList] = React.useState([]);
  const [colors, setColors] = React.useState([]);
  const [chosenColors, setChosenColors] = React.useState([]);
  const [chosenSizes, setChosenSizes] = React.useState([]);
  const [sizes, setSizes] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { auth, logout } = useAuthStore((state) => state);
  const [useRole, setUseRole] = React.useState("");
  const [viewCategory, setViewCategory] = React.useState(null);
  const [newCategory, setNewCategory] = React.useState();

  React.useEffect(
    (e) => {
      if (auth) {
        const refreshToken = window.localStorage.getItem("refreshToken");
        if (refreshToken) {
          axiosClient.post("/auth/refresh-token", {
            refreshToken: refreshToken,
          });
        }
      }
    },
    [auth, logout, refresh]
  );

  React.useEffect((e) => {
    if (auth) {
      axiosClient
        .get("/login/" + auth?.loggedInUser?._id, e)
        .then((response) => {
          setUseRole(response.data.role);
        });
    }
  }, []);
  const columns = [
    {
      title: "Hình ảnh",
      key: "imageUrl",
      dataIndex: "imageUrl",
      render: (text, record) => {
        return (
          <div>
            {text && (
              <React.Fragment>
                <Image
                  onClick={() => {
                    setRefresh((f) => f + 1);
                    setSelectedRecord(record);
                    setIsPreview(true);
                  }}
                  preview={{
                    visible: false,
                  }}
                  width={60}
                  src={`${API_URL}${text[0]}`}
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
                    {record &&
                      record.imageUrl &&
                      record.imageUrl.map((image) => {
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
      title: "Chi tiết",
      dataIndex: "variants",
      width: "40%",
      key: "details",
      render: (variants, record) => (
        <ul>
          {variants.map((color, index) => (
            <li key={index}>
              <strong>
                {" "}
                Màu: {record?.color[index].name} - Giá bán:{" "}
                {numeral(color.price).format("0,0$")} - Giảm giá:{" "}
                {numeral(color.discount).format("0,0.0")}%
              </strong>
              <ul>
                {color.sizes.map((size, i) => (
                  <li key={i}>
                    Cỡ: {record?.size[index][i].size} - Số lượng:{" "}
                    {size.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ),
    },

    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      align: "right",
      render: (text) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "",
      key: "actions",
      render: (text, record) => {
        return (
          <>
            {(useRole === "Admin") | (useRole === "Quản lý") ? (
              <Space>
                {useRole === "Admin" && (
                  <Popconfirm
                    style={{ width: 800 }}
                    title="Are you sure to delete?"
                    onConfirm={() => {
                      setRefresh((f) => f + 1);
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
                )}
                <Button
                  type="dashed"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setRefresh((f) => f + 1);
                    setSelectedRecord(record);
                    console.log("Selected Record", record);
                    updateForm.setFieldsValue(record);
                    setEditFormVisible(true);
                  }}
                />
                <Button
                  disabled={record.promotion === "Yes"}
                  type="dashed"
                  icon={<LikeFilled />}
                  onClick={() => {
                    setRefresh((f) => f + 1);
                    axiosClient
                      .patch("/products/" + record._id, { promotion: "Yes" })
                      .then((response) => {
                        message.success("Đã thêm vào danh sách yêu thích");
                        setRefresh((f) => f + 1);
                      });
                    setRefresh((f) => f + 1);
                  }}
                />
                <Upload
                  showUploadList={false}
                  name="files[]"
                  action={
                    API_URL + "/upload/products/" + record._id + "/images"
                  }
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
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

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
  }, [refresh]);
  const onNewCategory = (event) => {
    setNewCategory(event.target.value);
  };
  React.useEffect(() => {
    axiosClient
      .post("/products/category", { categoryId: viewCategory })
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
      });
  }, [viewCategory, refresh]);

  const onFinish = (values) => {
    console.log(values);
    axiosClient
      .post("/products", values)
      .then((response) => {
        console.log("kjaskj", response);

        // UPLOAD FILES
        const { _id } = response.data;
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append("files[]", file);
        });
        axios
          .post(API_URL + "/upload/products/" + _id, formData)
          .then((respose) => {
            message.success("Thêm mới thành công!");
            createForm.resetFields();
            setFileList([]);
            setRefresh((f) => f + 1);
          })
          .catch((err) => {
            message.error("Upload file bị lỗi!");
          });
      })
      .catch((err) => {
        console.log(err);
        message.error("Thêm mới bị lỗi!");
      });
  };

  const onFinishFailed = (errors, response, values) => {
    console.log("🐣", errors.values);
  };
  const showModal = () => {
    setRefresh((f) => f + 1);
    setIsModalVisible(true);
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
      {useRole === "Admin" && (
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
          <Form.List name="variants">
              <>
                    <Form.Item
                      label="Màu"
                      name="colorId"
                      rules={[{ required: true, message: "Hãy chọn một màu!" }]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        value={colors}
                        style={{
                          width: 300,
                        }}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider
                              style={{
                                margin: "4px 0",
                              }}
                            />
                            <Space
                              style={{
                                padding: "0 4px 2px",
                              }}
                            >
                              <Button
                                type="text"
                                icon={<PlusOutlined />}
                                onClick={showModal}
                              >
                                Thêm màu mới
                              </Button>
                            </Space>
                          </>
                        )}
                        virtual
                        optionHeight={20}
                      >
                        {colors
                          .map((color, index) => (
                            <Select.Option key={color._id} value={color._id}>
                              <span
                                style={{
                                  backgroundColor: color.hexcode[0].hex,
                                  display: "inline-block",
                                  width: "10px",
                                  height: "10px",
                                  marginRight: "3px",
                                }}
                              />
                              {color.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Modal
                      open={isModalVisible}
                      onCancel={() => {
                        setRefresh((f) => f + 1);
                        setIsModalVisible(false);
                      }}
                      onOk={() => {
                        setRefresh((f) => f + 1);
                        setIsModalVisible(false);
                      }}
                    >
                      <ColorForm />
                    </Modal>
                    <Form.Item
                      label="Giá"
                      name="price"
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập giá bán!",
                        },
                      ]}
                    >
                      <Input type="number" min={0} style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      label="Discount"
                      name="discount"
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
                      name="sizes"
                    >
                      <Form.List name="sizes">
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
                                    onChange={(sizeId) => {
                                      const selectedSize = sizes.find(
                                        (size) => size._id === sizeId
                                      );
                                      const existingSizeIndex =
                                        chosenSizes.findIndex(
                                          (c) => c.id === sizeField.key
                                        );
                                      if (existingSizeIndex === -1) {
                                        setChosenSizes([
                                          ...chosenSizes,
                                          {
                                            id: sizeField.key,
                                            sizeId: sizeId,
                                            size: selectedSize.size,
                                          },
                                        ]);
                                      } else {
                                        const newChosenSizes = [...chosenSizes];
                                        newChosenSizes[existingSizeIndex] = {
                                          id: sizeField.key,
                                          sizeId: sizeId,
                                          size: selectedSize.size,
                                        };
                                        setChosenSizes(newChosenSizes);
                                      }
                                    }}
                                    style={{ width: 150 }}
                                    options={
                                      sizes &&
                                      sizes
                                        .filter(
                                          (size) =>
                                            chosenSizes.findIndex(
                                              (c) => c.sizeId === size._id
                                            ) === -1
                                        )
                                        .map((c) => {
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
                                    onClick={() => {
                                      setRefresh((f) => f + 1);
                                      removeSize(sizeField.name);
                                    }}
                                    icon={<DeleteOutlined />}
                                  >
                                    Xóa kích cỡ
                                  </Button>
                                </Form.Item>
                              </div>
                            ))}
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                              <Button
                                onClick={() => {
                                  setRefresh((f) => f + 1);
                                  addSize();
                                }}
                                icon={<PlusCircleOutlined />}
                              >
                                Thêm kích cỡ
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>

                    {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button
                        onClick={() => {
                          setRefresh((f) => f + 1);
                          remove(field.name);
                        }}
                        icon={<DeleteOutlined />}
                      >
                        Xóa màu
                      </Button>
                    </Form.Item> */}

                {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    onClick={() => {
                      setRefresh((f) => f + 1);
                      add();
                    }}
                    icon={<PlusCircleOutlined />}
                  >
                    Thêm màu
                  </Button>
                </Form.Item> */}
              </>

          </Form.List>
          <Form.Item label="Hình minh họa" name="files">
            <Upload {...props}>
              <Button icon={<PlusOutlined />}>Tải lên</Button>
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" block>
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      )}
      
      <Table
        rowKey="_id"
        dataSource={products}
        columns={columns}
        scroll={{ y: 500 }}
        expandable={{
          expandedRowRender: (record) => (
            <Descriptions
              bordered
              column={3}
              labelStyle={{ fontWeight: "700" }}
            >
              <Descriptions.Item label="Mô tả sản phẩm">
                {record.description}
              </Descriptions.Item>
              <Descriptions.Item label="Hướng dẫn bảo quản">
                {record.preserveGuide}
              </Descriptions.Item>
            </Descriptions>
          ),
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
          
          <Form.List name="variants">
              <>
                    <Form.Item
                      label="Màu"
                      name="colorId"
                      rules={[{ required: true, message: "Hãy chọn một màu!" }]}
                    >
                      <Select
                        showSearch
                        optionFilterProp="children"
                        value={colors}
                        style={{
                          width: 300,
                        }}
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider
                              style={{
                                margin: "4px 0",
                              }}
                            />
                            <Space
                              style={{
                                padding: "0 4px 2px",
                              }}
                            >
                              <Button
                                type="text"
                                icon={<PlusOutlined />}
                                onClick={showModal}
                              >
                                Thêm màu mới
                              </Button>
                            </Space>
                          </>
                        )}
                        virtual
                        optionHeight={20}
                      >
                        {colors
                          .map((color, index) => (
                            <Select.Option key={color._id} value={color._id}>
                              <span
                                style={{
                                  backgroundColor: color.hexcode[0].hex,
                                  display: "inline-block",
                                  width: "10px",
                                  height: "10px",
                                  marginRight: "3px",
                                }}
                              />
                              {color.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Modal
                      open={isModalVisible}
                      onCancel={() => {
                        setRefresh((f) => f + 1);
                        setIsModalVisible(false);
                      }}
                      onOk={() => {
                        setRefresh((f) => f + 1);
                        setIsModalVisible(false);
                      }}
                    >
                      <ColorForm />
                    </Modal>
                    <Form.Item
                      label="Giá"
                      name="price"
                      rules={[
                        {
                          required: true,
                          message: "Hãy nhập giá bán!",
                        },
                      ]}
                    >
                      <Input type="number" min={0} style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      label="Discount"
                      name="discount"
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
                      name="sizes"
                    >
                      <Form.List name="sizes">
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
                                    onChange={(sizeId) => {
                                      const selectedSize = sizes.find(
                                        (size) => size._id === sizeId
                                      );
                                      const existingSizeIndex =
                                        chosenSizes.findIndex(
                                          (c) => c.id === sizeField.key
                                        );
                                      if (existingSizeIndex === -1) {
                                        setChosenSizes([
                                          ...chosenSizes,
                                          {
                                            id: sizeField.key,
                                            sizeId: sizeId,
                                            size: selectedSize.size,
                                          },
                                        ]);
                                      } else {
                                        const newChosenSizes = [...chosenSizes];
                                        newChosenSizes[existingSizeIndex] = {
                                          id: sizeField.key,
                                          sizeId: sizeId,
                                          size: selectedSize.size,
                                        };
                                        setChosenSizes(newChosenSizes);
                                      }
                                    }}
                                    style={{ width: 150 }}
                                    options={
                                      sizes &&
                                      sizes
                                        .filter(
                                          (size) =>
                                            chosenSizes.findIndex(
                                              (c) => c.sizeId === size._id
                                            ) === -1
                                        )
                                        .map((c) => {
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
                                    onClick={() => {
                                      setRefresh((f) => f + 1);
                                      removeSize(sizeField.name);
                                    }}
                                    icon={<DeleteOutlined />}
                                  >
                                    Xóa kích cỡ
                                  </Button>
                                </Form.Item>
                              </div>
                            ))}
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                              <Button
                                onClick={() => {
                                  setRefresh((f) => f + 1);
                                  addSize();
                                }}
                                icon={<PlusCircleOutlined />}
                              >
                                Thêm kích cỡ
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>

                    {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button
                        onClick={() => {
                          setRefresh((f) => f + 1);
                          remove(field.name);
                        }}
                        icon={<DeleteOutlined />}
                      >
                        Xóa màu
                      </Button>
                    </Form.Item> */}

                {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button
                    onClick={() => {
                      setRefresh((f) => f + 1);
                      add();
                    }}
                    icon={<PlusCircleOutlined />}
                  >
                    Thêm màu
                  </Button>
                </Form.Item> */}
              </>

          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}
