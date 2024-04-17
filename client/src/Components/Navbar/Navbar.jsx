import { Link } from "react-router-dom";
import { useAuthContext } from "../../Context/AuthContext";
import useLogout from "../../Hooks/useLogout";

const Navbar = () => {
    const { authUser } = useAuthContext();
    const { logout } = useLogout();
    return (
        <div className="px-20 shadow-2xl  sticky top-0 z-10">
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    
                    <div className="w-36 ">
                        <img alt="Tailwind CSS Navbar component" src="https://i.ibb.co/0KFnPyD/cais-high-resolution-logo-black-transparent.png" />
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">

                </div>
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS Navbar component" src={authUser.image} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <Link to='/profile' className="justify-between">
                                    Profile
                                </Link>
                            </li>
                            <li onClick={() => logout()}><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;