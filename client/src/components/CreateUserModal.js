import { Button, Input, Form, Modal, Select, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CreateUserModal = ({ isVisible, setIsVisible, notification, setReload }) => {
  const token = useSelector((state) => state.auth.token);
  const [fileList, setFileList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments
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

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList.slice(-1));
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Convert DatePicker value to string format
      const formattedData = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
        salary: parseFloat(values.salary), // Ensure salary is a number
      };

      // Append Image File
      const formData = new FormData();
      Object.entries(formattedData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      const response = await fetch("http://localhost:9999/api/user/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Authorization inside headers
        },
        body: formData, // ✅ FormData handled correctly
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      notification.success("User created successfully!");
      setIsVisible(false); // ✅ Correct state update
      setReload(Date.now());
      form.resetFields();
      setFileList([]); // ✅ Clear file after upload
    } catch (error) {
      console.error("Error creating user:", error);
      notification.error("Something went wrong!");
    }
  };


  return (
    <Modal
      title="Create User"
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      onOk={handleSave}
    >
      <Form form={form} layout="vertical">
        {/* Upload Image */}
        <Form.Item label="Upload Avatar"
          rules={[{ required: true, message: "Profile picture is required" }]}
        >
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Prevent automatic upload
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Name is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Valid email required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: "Password is required" }]}>
          <Input type="password" />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Phone is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Gender is required" }]}>
          <Select>
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="dob" label="Date of Birth"
          rules={[{ required: true, message: "Birthday is required" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="address" label="Address"
          rules={[{ required: true, message: "Address is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="baseSalary" label="Salary"
          rules={[{ required: true, message: "Salary is required" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item name="department" label="Department"
          rules={[{ required: true, message: "Department is required" }]}
        >
          <Select>
            {departments.map((dept) => (
              <Select.Option key={dept._id} value={dept._id}>{dept.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="role" label="Role" initialValue="User">
          <Select>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="User">User</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="startDate" label="Start working on"
          rules={[{ required: true, message: "Start date is required" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
