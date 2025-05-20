import { Form, Input, Modal } from "antd";
import { useSelector } from "react-redux";

const CreateDeptModal = ({ notification,isVisible, setIsVisible, setReload }) => {
  const token = useSelector((state) => state.auth.token);
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields

      const response = await fetch("http://localhost:9999/api/department/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create department");
      }

      notification.success("Department created successfully!"); // Show success notification
      setIsVisible(false); // Close modal
      form.resetFields(); // Reset form fields
      setReload(Date.now()); // Trigger data reload

    } catch (error) {
      console.error("Error creating department:", error);
      notification.error("Failed to create department."); // Show error notification
    }
  };

  return (
    <Modal
      title="Create Department"
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      onOk={handleSave}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Name is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Description is required" }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateDeptModal;

