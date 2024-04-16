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
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a>Item 1</a></li>
                            <li>
                                <a>Parent</a>
                                <ul className="p-2">
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </li>
                            <li><a>Item 3</a></li>
                        </ul>
                    </div>
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