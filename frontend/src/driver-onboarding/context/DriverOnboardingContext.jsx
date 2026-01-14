import { createContext, useContext, useState, useEffect } from "react";

const DriverOnboardingContext = createContext(null);

export const DriverOnboardingProvider = ({ children }) => {
  const [driverStatus, setDriverStatus] = useState("none");
  // none | pending | verified

  useEffect(() => {
    const stored = localStorage.getItem("driverStatus");
    if (stored) setDriverStatus(stored);
  }, []);

  const markPending = () => {
    localStorage.setItem("driverStatus", "pending");
    setDriverStatus("pending");
  };

  const markVerified = () => {
    localStorage.setItem("driverStatus", "verified");
    setDriverStatus("verified");
  };

  return (
    <DriverOnboardingContext.Provider
      value={{ driverStatus, markPending, markVerified }}
    >
      {children}
    </DriverOnboardingContext.Provider>
  );
};

export const useDriverOnboarding = () => {
  const ctx = useContext(DriverOnboardingContext);
  if (!ctx) {
    throw new Error("useDriverOnboarding must be used inside provider");
  }
  return ctx;
};
