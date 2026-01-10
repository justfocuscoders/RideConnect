import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const useUserGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);

    if (decoded.role !== "user") {
      navigate("/unauthorized");
    }
  }, [navigate]);
};

export default useUserGuard;
