import { Link } from "react-router-dom";
import useSignup from "../../Hooks/useSignup";
import { useAuthContext } from "../../Context/AuthContext";
import { HashLoader  } from 'react-spinners';
const Signup = () => {
    const { location  } = useAuthContext();
    const { signup ,loading } = useSignup();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const fullName = form.fullName.value;
        const username = form.username.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const role = form.role.value;
        const email = form.email.value;
        const phone = form.phone.value;
        const image = form.image.files[0]; // Accessing the image file from the file input field
    
        const formData = new FormData();
        formData.append('image', image);
        const url = 'https://api.imgbb.com/1/upload?key=6b61fed2ade9e1cb6596b28fb4315762'; // Replace YOUR_API_KEY with your actual API key
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Image upload failed');
            }
            const imageData = await response.json();
            if (imageData.success) {
                const input = {
                    fullName,
                    username,
                    password,
                    confirmPassword,
                    role,
                    image: imageData.data.url,
                    location,
                    email,
                    phone
                };
                console.log(input);
                await signup(input);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    
        form.reset();
    };
    

    return (
        <div className="hero min-h-screen bg-base-200">
            {
                loading ? <HashLoader color="#020303" /> : <div className="hero-content flex-col lg:flex-row gap-5">
                <div className="w-1/2">
                    <img src='https://i.ibb.co/qCwS5cx/image-removebg-preview-5.png' className=" rounded-lg max-w-[15rem] lg:max-w-sm" />
                </div>
                <div className="flex justify-center w-full lg:w-1/2">
                    <div className="card w-full ">
                        <div className="card-body items-center text-center">
                            <form onSubmit={handleSubmit} className="  flex-col">

                                <input
                                    type="file"
                                    name="image" // Changed name to match the key used to access the file
                                    className="input text-center  input-bordered w-full max-w-xs"
                                />


                                <br />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    className="input mt-5 input-bordered w-full max-w-xs"
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
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="input mt-5 input-bordered w-full max-w-xs"
                                    required
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
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
            }
        </div>

    );
};

export default Signup;
