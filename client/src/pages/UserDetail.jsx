import { useNavigate, useParams } from "react-router-dom";
import { Button, Calendar, Card, Badge, Image, Col, Row, Modal, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import UserEditModal from "../components/UserEditModal";
import { toast, ToastContainer } from "react-toastify";

const UserDetailPage = () => {
  //User Info
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  //Calendar
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  //Update user modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  //Delete user modal
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:9999/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };

    const fetchUserAttendance = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:9999/api/attendance/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    };

    const fetchHolidays = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:9999/api/holidays/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setHolidays(data.map((holiday) => ({
          date: dayjs(holiday.date).format("YYYY-MM-DD"),
          name: holiday.name
        })));
      }
    };

    fetchUserDetail();
    fetchUserAttendance();
    fetchHolidays();
  }, [userId]);

  // Render attendance and holiday data inside calendar
  const dateCellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");

    // Find attendance entries
    const dailyAttendance = attendance.filter((item) =>
      dayjs(item.date).format("YYYY-MM-DD") === dateStr
    );

    // Find holiday entries
    const holiday = holidays.find((h) => h.date === dateStr);

    return (
      <ul style={{ padding: 0, margin: 0 }}>
        {holiday && (
          <li style={{ color: "red", fontWeight: "bold", listStyle: "none" }}>
            🎉 {holiday.name}
          </li>
        )}
        {dailyAttendance.map((entry) => (
          <li key={entry._id}
            style={{ fontSize: "12px", listStyle: "none" }}
          >
            <Badge status="success" text={`Check-in: ${dayjs(entry.checkIn).format("HH:mm:ss")}`} />
            <Badge status="error" text={`Check-out: ${dayjs(entry.checkOut).format("HH:mm:ss")}`} />
          </li>
        ))}
      </ul>
    );
  };



  const showModal = () => {
    console.log(user)
    setIsModalVisible(true);
    form.setFieldsValue({
      ...user,
      department: user?.department?._id,
      salary: user?.salary.amount,
      dob: user.dob ? dayjs(user.dob) : null
    }); // Populate form with existing user data
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = async ({ fileList }) => {
    try {
      const values = await form.validateFields();

      // Format the date before sending
      const formattedDob = values.dob ? values.dob.format("YYYY-MM-DD") : null;

      // Create FormData for sending both image and text data
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("dob", formattedDob);
      formData.append("address", values.address);
      formData.append("department", values.department);
      formData.append("baseSalary", values.salary);

      // Append the image file if uploaded
      if (fileList.length > 0) {
        console.log("Smthing here: ", fileList)
        formData.append("image", fileList[0].originFileObj);
      }

      const token = localStorage.getItem("accessToken");

      // Send PUT request with FormData
      const response = await fetch(`http://localhost:9999/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // No need for Content-Type with FormData
        },
        body: formData,
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      }

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const showDeleteModal = () => {
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Assuming you store the token
      const response = await fetch(`http://localhost:9999/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmLoading(true);

      if (response.ok) {
        toast.success("User deleted successfully");
        setConfirmLoading(false);
        showDeleteModal(false);
        setUser({});

        // TODO: Refresh the user list or navigate away
      } else {
        toast.error("Failed to delete user");
        setConfirmLoading(false);
      }
    } catch (error) {
      setConfirmLoading(false);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return (
    <div>
      {user ? (
        <>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {`${user.fullName}'s Profile`}
                <div>
                  <Button style={{ backgroundColor: "#52c41a", color: "white" }} icon={<EditOutlined />} onClick={showModal}>
                    Update
                  </Button>

                  <Button style={{ backgroundColor: "#ff4d4f", color: "white" }} icon={<DeleteOutlined />} onClick={showDeleteModal}>
                    Delete
                  </Button>
                  <Modal
                    title="Confirm delete"
                    open={open}
                    onOk={handleDelete}
                    confirmLoading={confirmLoading}
                    onCancel={handleDeleteCancel}
                  >
                    <p>Confirm delete</p>
                  </Modal>
                </div>
              </div>
            }
            style={{ marginBottom: 20 }}>
            <Row gutter={16} align="top">
              {/* Column 1: Personal Information */}
              <Col xs={24} sm={8}>
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Address:</strong> {user.address}</p>
              </Col>

              {/* Column 2: Additional Information */}
              <Col xs={24} sm={8}>
                <p><strong>Birthday:</strong> {dayjs(user.dob).format("DD/MM/YYYY")}</p>
                <p><strong>Department:</strong> {user?.department?.name}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Date started:</strong> {dayjs(user.startDate).format("DD/MM/YYYY")}</p>
              </Col>

              {/* Column 3: Avatar */}
              <Col xs={24} sm={8} style={{ textAlign: "right" }}>
                <Image
                  height={150}
                  width={150}
                  src={user.avatar?.url}
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                />
              </Col>
            </Row>
          </Card>
          <Card title="Attendance Calendar">
            <Calendar dateCellRender={dateCellRender} />
          </Card>
        </>
      ) : (
        <p style={{
          margin: "0 auto",
          fontSize: "18px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "10px"
        }}>User not found...</p>
      )}


      <UserEditModal
        isModalVisible={isModalVisible}
        handleSave={handleSave}
        handleCancel={handleCancel}
        form={form}
      />
      <ToastContainer />
    </div>
  );
};

export default UserDetailPage;

