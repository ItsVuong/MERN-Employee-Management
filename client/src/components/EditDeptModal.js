import { Form, Input, Modal } from "antd";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";

const UpdateDeptModal = ({ isVisible, setIsVisible, department, setReload }) => {
  const token = useSelector((state) => state.auth.token);
  const [form] = Form.useForm();

  // Prefill form when department changes
  useEffect(() => {
    if (department) {
      form.setFieldsValue({
        name: department.name,
        description: department.description,
      });
    }
  }, [department, form]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields(); // Validate form

      const response = await fetch(`http://localhost:9999/api/department/update/${department._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update department");
      }

      toast.success("Department updated successfully!");
      setIsVisible(false);
      form.resetFields();
      setReload((prev) => !prev); // Reload department list
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update department.");
    }
  };

  return (
    <Modal
      title="Update Department"
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      onOk={handleUpdate}
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

export default UpdateDeptModal;
