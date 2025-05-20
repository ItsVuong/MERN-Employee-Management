import { Button, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import '../styles/GlobalStyle.css'
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CreateDeptModal from "../components/CreateDepartmentModal";
import { toast, ToastContainer } from "react-toastify";
import UpdateDeptModal from "../components/EditDeptModal";
import DeleteDeptModal from "../components/DeleteModal";
import { useSelector } from "react-redux";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:9999";

const DepartmentsPage = () => {
  const token = useSelector(state => state.auth.token);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({ pageSize: 10, currentPage: 1 });
  const [totalCount, setTotalCount] = useState(0)

  //Set visibililty of modals (Edit, Create and Update modals)
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const [reload, setReload] = useState(Date.now());
  const [selectedDept, setSelectedDept] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, [reload]);

  const fetchDepartments = async () => {
    try {
      console.log(API_BASE_URL);
      console.log("API Base URL:", process.env.API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/api/department`);
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data.departments);
      setTotalCount(data.total);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleEdit = (department) => {
    // Open edit modal or navigate to edit page
    setSelectedDept(department);
    setIsEditVisible(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:9999/api/department/delete/${selectedDept._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete department");
      }

      toast.success("Department deleted successfully!");
      setIsDeleteVisible(false);
      setReload((prev) => !prev); // Reload department list
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department.");
    }
  };


  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      render: (text, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            style={{ backgroundColor: "#ff4d4f", color: "white" }}
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedDept(record);
              setIsDeleteVisible(true)
            }}
          >
            Delete
          </Button>
        </div>
      ),
    }
  ]

  return (
    <>
      <ToastContainer />
      <DeleteDeptModal
        isVisible={isDeleteVisible}
        setIsVisible={setIsDeleteVisible}
        handleDelete={handleDelete}
        deleteItem={selectedDept.name}
      />
      <UpdateDeptModal isVisible={isEditVisible}
        setIsVisible={setIsEditVisible}
        setReload={setReload}
        department={selectedDept}
      />
      <CreateDeptModal isVisible={isCreateVisible}
        setIsVisible={setIsCreateVisible}
        notification={toast}
        setReload={setReload}
      />
      <div style={{ display: 'flex', justifyContent: "space-between" }}>
        <h1 style={{ fontWeight: 'bold' }}>Departments</h1>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setIsCreateVisible(true)}
        >
          Create
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={departments}
        pagination={{
          current: filters.currentPage,
          pageSize: filters.pageSize,
          total: totalCount,
          onChange: (page) => {
            setFilters((prev) => {
              const updatedFilters = { ...prev, currentPage: page };
              fetchDepartments(updatedFilters); // Fetch users with updated filters
              return updatedFilters;
            });
          },
        }}
        rowKey="id"
      />
    </>
  )
}

export default DepartmentsPage;
