import { Modal } from "antd";

const DeleteDeptModal = ({ isVisible, setIsVisible, handleDelete, deleteItem }) => {

  return (
    <Modal
      title="Confirm Delete"
      open={isVisible}
      onCancel={() => setIsVisible(false)}
      onOk={handleDelete}
      okText="Delete"
      okType="danger"
    >
      <p>Are you sure you want to delete <strong>{deleteItem}</strong>?</p>
    </Modal>
  );
};

export default DeleteDeptModal;
