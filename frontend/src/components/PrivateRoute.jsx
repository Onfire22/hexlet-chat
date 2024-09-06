import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../routes/routes.js';
import { loggedIn } from '../store/slices/authSlice.js';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  dispatch(loggedIn());
  const token = useSelector((state) => state.auth.token);
  if (!token) {
    return <Navigate to={ROUTES.login} />;
  }
  return children;
};

export default PrivateRoute;
