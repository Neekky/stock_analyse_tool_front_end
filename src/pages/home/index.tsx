import { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from "react-router-dom";
import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import './index.less';

const { Header, Content, Footer } = Layout;

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
  getItem('龙虎榜分析', '4', <DesktopOutlined />),
  getItem('早盘自研涨停板分析', '5', <DesktopOutlined />),
  getItem('龙头脉络分析', '6', <DesktopOutlined />),
];

const App: React.FC = () => {

  const navigate = useNavigate();

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
        navigate('/home/limitup-analyse');
        break;

      case "3":
        navigate('/home/multi-limitup-analyse');
        break;

      case "4":
        navigate('/home/winners-list-analyse');
        break;

      case "5":
        navigate('/home/early-limit-analyse');
        break;
      
      case "6":
        navigate('/home/leading-trend-analyse');
        break;

      default:
        navigate('/');
        break;
    }
  };

  return (
    <div className="root-wrapper">
      <div className="sider-wrapper">
        <div className="demo-logo-vertical" />
        <div className="menu-wrapper">
          <Menu onSelect={onMenuSelect} theme="dark" defaultSelectedKeys={[menuKey]} mode="inline" items={items} />
        </div>
      </div>
      <div className="content-wrapper">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <div className='outlet-wrapper'>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </div>
    </div>
  );
};

export default App;