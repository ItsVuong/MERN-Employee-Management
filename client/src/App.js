import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import "antd/dist/reset.css"
import LoginPage from './pages/LoginPage';
import { Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetail';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/authSlice';
import DepartmentsPage from './pages/DepartmentsPage';

const Dashboard = () => <h2>Welcome to the Dashboard</h2>;

const SidebarLayout = ({ children, onLogout }) => (
  <Layout style={{ minHeight: "100vh" }}>
    <Sider collapsible>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={""}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={""} >
          <Link to="/employees">Employees</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={""} >
          <Link to="/departments">Department</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={""} onClick={onLogout}>
          Logout
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout>
      <Content style={{ margin: "16px" }}>{children}</Content>
    </Layout>
  </Layout>
);

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    console.log("Logging out...");
    console.log(user?.role)
    console.log(token)
    dispatch(logout());
  };

  return (
    <Router>
      <Routes>
        <Route path="/"
          element={
            isAuthenticated ? (
              user && user.role === "Admin" ? <Navigate to="/dashboard" /> : <Navigate to="/employees" />
            ) : (
              <LoginPage />)
          } />
        <Route path="/employees" element={isAuthenticated ? <SidebarLayout onLogout={handleLogout}><UsersPage /></SidebarLayout> : <Navigate to="/" />} />
        <Route path="/employees/:userId" element={isAuthenticated ? <SidebarLayout onLogout={handleLogout}><UserDetailPage /></SidebarLayout> : <Navigate to="/" />} />
        <Route path="/dashboard" element={isAuthenticated ? <SidebarLayout onLogout={handleLogout}><Dashboard /></SidebarLayout> : <Navigate to="/" />} />
        <Route path="/departments" element={isAuthenticated ? <SidebarLayout onLogout={handleLogout}><DepartmentsPage /></SidebarLayout> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};


export default App;
