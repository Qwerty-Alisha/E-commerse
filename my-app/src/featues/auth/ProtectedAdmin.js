import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from './authSlice';
import { selectUserInfo } from '../user/userSlice';

function ProtectedAdmin({ children }) {
  const user = useSelector(selectLoggedInUser);
  const userInfo = useSelector(selectUserInfo);

if (!user) {
    return <Navigate to="/login" replace={true}></Navigate>;
  }

  // ✅ FIX: Add this check. If userInfo is null (still loading), wait.
  // Do NOT try to access userInfo.role if userInfo is null.
  if (!userInfo) {
     return <div className="p-10">Loading...</div>;
  }

  if (userInfo && userInfo.role !== 'admin') {
    return <Navigate to="/" replace={true}></Navigate>;
  }
  return children;
}

export default ProtectedAdmin;