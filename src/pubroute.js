import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "context";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return !isAuthenticated ? children : <Navigate to="/internal-device-management" />;
};

export default PublicRoute;