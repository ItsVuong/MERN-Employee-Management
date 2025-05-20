import { Button, Input, Form, Modal, Select, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

{/* Edit Modal */ }
const UserEditModal = ({ isModalVisible, handleCancel, handleSave, form }) => {
  const [fileList, setFileList] = useState([]);
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    fetchDepartments();
  }, []);

  //Get department for updating user
  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:9999/api/department");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      console.log(data)
      setDepartments(data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList.slice(-1));
  };

  return (
    <Modal title="Edit User" open={isModalVisible} onCancel={handleCancel} onOk={() => handleSave({ fileList })}>
      <Form form={form} layout="vertical">
        {/* Upload Image */}
        <Form.Item label="Upload Avatar">
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
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Select>
            <Select.Option value="Male">Male</Select.Option>
            <Select.Option value="Female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="dob" label="Date of Birth">
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input />
        </Form.Item>
        <Form.Item name="salary" label="Salary">
          <Input />
        </Form.Item>
        <Form.Item name="department" label="Department">
          <Select>
            {departments.map(dept => {
              return (
                <Select.Option value={dept._id}>{dept.name}</Select.Option>
              )
            }
            )}
          </Select>
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Select>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="User">User</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  )
}
export default UserEditModal
