import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { VotingContext } from "./context/VotingContext";

const PrivateRoute = ({ element }) => {
  const { userEmail } = useContext(VotingContext);

  return userEmail ? element : <Navigate to="/" replace />;
};

PrivateRoute.propTypes = {
  element: PropTypes.node.isRequired,
};

export default PrivateRoute
