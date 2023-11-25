import React, { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('首页', '1', <PieChartOutlined />),
  getItem('涨停分析', '2', <DesktopOutlined />),
  getItem('多板分析', '3', <DesktopOutlined />),
];

const App: React.FC = (props) => {

  const navigate = useNavigate();

  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const [menuKey, setMenuKey] = useState('1');



  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onMenuSelect = (data) => {
    const { key } = data;
    setMenuKey(key)
    switch (key) {
      case "1":
        navigate('/');
        break;

      case "2":
        navigate('/limitup-analyse');
        break;

      case "3":
        navigate('/multi-limitup-analyse');
        break;

      default:
        navigate('/');
        break;
    }
  };

  return (
    <Layout  style={{ minHeight: '100vh', width: '100vw' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu onSelect={onMenuSelect} theme="dark" defaultSelectedKeys={[menuKey]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default App;