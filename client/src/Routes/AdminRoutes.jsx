// Desc: Private Routes for authenticated users 
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../Context/AuthContext';



const AdminRoutes = ({children}) => {
    const { authUser } = useAuthContext();
    if (authUser && authUser.role === 'admin') {
        return children;
    }
    return <Navigate to='/login'></Navigate>
};

export default AdminRoutes;