import { Link } from "react-router-dom";
import useSignup from "../../Hooks/useSignup";
import signupimg from "../../assets/login.svg"
import { useRef } from "react";
import { IoImagesOutline } from "react-icons/io5";
import { useAuthContext } from "../../Context/AuthContext";
const Signup = () => {
    const { location } = useAuthContext();
    const { signup } = useSignup();
    const fileInputRef = useRef(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const fullName = form.fullName.value;
        const username = form.username.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const role = form.role.value;
        const image = fileInputRef.current.files[0];
        
        const formData = new FormData();
        formData.append('image',image);
        const url = 'https://api.imgbb.com/1/upload?key=6b61fed2ade9e1cb6596b28fb4315762';
        fetch(url, {
            method: 'POST',
            body:formData
        })
        .then(res => res.json())
        .then(async imageData => {
            if(imageData.success){
                const input = {
                    fullName,
                    username,
                    password,
                    confirmPassword,
                    role,
                    image:imageData.data.url,
                    location
                };
                await signup(input);
            }
            
        })
       
        form.reset();
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row gap-5">
                <div className="w-1/2">
                    <img src='https://i.ibb.co/KjcLt1C/cais-high-resolution-logo-transparent-1.png' className=" rounded-lg max-w-[15rem] lg:max-w-sm" />
                </div>
                <div className="flex justify-center w-full lg:w-1/2">
                    <div className="card w-full ">
                        <div className="card-body items-center text-center">
                            <form onSubmit={handleSubmit} className="  flex-col">
                                <div className="relative inline-block">
                                    <input
                                        type="file"
                                        id="fileInput"
                                        name="file"
                                        className="sr-only"
                                        ref={fileInputRef} // Assign the ref to the input element
                                    />
                                    <label htmlFor="fileInput" className="cursor-pointer ">
                                    <IoImagesOutline className="text-4xl " />
                                    </label>
                                </div>
                                <br/>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    className="input  input-bordered w-full max-w-xs"
                                    required
                                />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="User Name"
                                    className="input mt-5 input-bordered w-full max-w-xs"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Type Password"
                                    className="input mt-5 input-bordered w-full max-w-xs"
                                    required
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="input mt-5 input-bordered w-full max-w-xs"
                                    required
                                />
                                <select name="role" className="select mt-5 select-bordered w-full max-w-xs">
                                    <option disabled defaultValue>Role</option>
                                    <option>User</option>
                                    <option>Rider</option>
                                </select>
                                <input className="btn mt-10 w-full max-w-xs bg-slate-300" type="submit" value="SignUp" />
                            </form>
                            <h1 className=" ">Already have a account? <Link className="underline" to='/login'>Login</Link></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Signup;
