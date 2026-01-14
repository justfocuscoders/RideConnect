import Navbar from "../components/Navbar";

const LandingLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default LandingLayout;
