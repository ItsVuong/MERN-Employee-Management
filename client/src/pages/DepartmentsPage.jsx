import { useState } from "react";

const DepartmentsPage = () => {
  const [department, setDepartment] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://localhost:9999/api/department");
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };
  return (
    <>
    </>
  )
}
