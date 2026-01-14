import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../common/Navbar";

const PublicLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {isLandingPage && <Navbar />}
      <Outlet />
    </>
  );
};

export default PublicLayout;
