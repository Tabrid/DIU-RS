// Desc: Private Routes for authenticated users 
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../Context/AuthContext';



const PrivateRoute = ({children}) => {
    const { authUser } = useAuthContext();
    if (authUser) {
        return children;
    }
    return <Navigate to='/login'></Navigate>
};

export default PrivateRoute;