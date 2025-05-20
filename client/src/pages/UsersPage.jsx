import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, Form, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import '../styles/GlobalStyle.css'
import { useSelector } from "react-redux";
import { EditOutlined } from "@ant-design/icons";
import CreateUserModal from "../components/CreateUserModal";
import { toast, ToastContainer } from "react-toastify";

const { Option } = Select;

const UsersPage = () => {
  const noti = toast;
  const [reload, setReload] = useState('');
  //Get token for api requests
  const token = useSelector((state) => state.auth.token);
  //Navigate
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  //Total user for pagination
  const [totalUsers, setTotalUsers] = useState(0); // Total users in the db for pagination
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    fullName: "",
    gender: "",
    department: "",
    phone: "",
    email: "",
    role: "",
    minSalary: "",
    maxSalary: "",
    pageSize: 10,
    startDate: "",
    currentPage: 1,
  });
  //Create user modal
  const [createUserModal, setCreateUserModal] = useState(false);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:9999/api/department");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchUsers = async (updatedFilters = filters) => {
    setLoading(true);
    try {
      const filteredParams = Object.entries(updatedFilters).reduce((acc, [key, value]) => {
        if (value) acc.append(key, value);
        return acc;
      }, new URLSearchParams());

      console.log(token);
      const response = await fetch(`http://localhost:9999/api/user/?${filteredParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.data);
      setTotalUsers(data.totalCount);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, [reload, filters]);

  const handleFilterChange = (changedValues) => {
    setFilters((prev) => ({ ...prev, ...changedValues }));
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Department", dataIndex: ["department", "name"], key: "department" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Salary", dataIndex: ["salary", "amount"], key: "salary",
      render: (ammount) => ammount.toLocaleString()
    },
  ];

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between", alignItems: "center",
        marginBottom: "12px"
      }}>
        <h2 style={{ fontWeight: "bold" }}>Users</h2>
        <Button style={{ backgroundColor: "#52c41a", color: "white" }} icon={<EditOutlined />}
          onClick={() => { setCreateUserModal(true) }}
        >
          Add user
        </Button>
      </div>
      <Form layout="inline" onValuesChange={(_, allValues) => handleFilterChange(allValues)}
      >
        <Form.Item name="fullName">
          <Input placeholder="Full Name" />
        </Form.Item>
        <Form.Item name="gender">
          <Select placeholder="Gender" style={{ width: 120 }} allowClear>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>
        <Form.Item name="department">
          <Select placeholder="Department" style={{ width: 150 }} allowClear>
            {departments.map((dept) => (
              <Option key={dept._id} value={dept._id}>{dept.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="phone">
          <Input placeholder="Phone" />
        </Form.Item>
        <Form.Item name="email">
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="role">
          <Input placeholder="Role" />
        </Form.Item>
        <Form.Item name="minSalary">
          <Input placeholder="Min Salary" type="number" />
        </Form.Item>
        <Form.Item name="maxSalary">
          <Input placeholder="Max Salary" type="number" />
        </Form.Item>
        <Form.Item name="startDate">
          <DatePicker.MonthPicker
            placeholder="Month joined"
            format="YYYY-MM"
            style={{ width: 150 }}
          />
        </Form.Item>

        {/*
        <Form.Item style={{ margin: '0 8px' }}>
          <Button type="primary" onClick={() => fetchUsers(filters)}>Search</Button>
        </Form.Item>
        */}
      </Form>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: filters.currentPage,
          pageSize: filters.pageSize,
          total: totalUsers,
          onChange: (page) => {
            setFilters((prev) => {
              const updatedFilters = { ...prev, currentPage: page };
              fetchUsers(updatedFilters); // Fetch users with updated filters
              return updatedFilters;
            });
          },
        }}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => navigate(`/employees/${record.id}`),
        })}
        rowClassName="table-row"
      />
      <CreateUserModal
        notification={noti}
        setReload={setReload}
        isVisible={createUserModal} setIsVisible={setCreateUserModal} />
      <ToastContainer />
    </div>
  );
};

export default UsersPage;

