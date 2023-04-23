import { DatabaseOutlined, HomeOutlined, FileTextOutlined, AreaChartOutlined, SettingOutlined, UserOutlined, ShopOutlined, MenuFoldOutlined, SkinOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const items = [
  { label: 'Đơn chờ lấy hàng', key: 'sales-orders', icon: <HomeOutlined /> },
  {
    label: 'Đơn đang giao',
    key: 'shipping',
    icon: <DatabaseOutlined />,
  },
  {
    label: 'Đơn đã hoàn thành',
    key: 'complete',
    icon: <ShopOutlined />,
  },
  { label: 'Đơn bị hủy', key: 'cancel', icon: <SettingOutlined /> },
  { label: 'Cài đặt tài khoản', key: 'account', icon: <SettingOutlined /> }
];

function renderMenuItems(items) {
  return items.map((item) => {
    if (item.children) {
      return (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
          {renderMenuItems(item.children)}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      );
    }
  });
}

export default function ShipperMenu() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  function handleCollapse() {
    setCollapsed(!collapsed);
  }

  return (
    <div>
        <Button onClick={handleCollapse}
         type="primary"
         style={{
          marginBottom: 16,
        }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      <Menu
        theme='dark'
        mode={collapsed ? 'vertical' : 'inline'}
        onClick={({ key }) => {
          navigate('/' + key.split('-').join('/'));
        }}
      >
        {renderMenuItems(items)}
      </Menu>
    </div>
  );
}
