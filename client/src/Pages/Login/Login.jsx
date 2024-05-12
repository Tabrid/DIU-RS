
import { Link } from "react-router-dom";
import useLogin from "../../Hooks/useLogin";

const Login = () => {
    const { login } = useLogin();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const username = form.username.value;
        const password = form.password.value;

        await login(username, password);

    };
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
                <img src="https://i.ibb.co/KjcLt1C/cais-high-resolution-logo-transparent-1.png" className="max-w-[15rem] lg:max-w-sm rounded-lg " />
                <div className="flex justify-center items-center  ">
                    <div className="card w-full ">
                        <div className="card-body items-center text-center">
                            <h1 className="text-2xl font-bold ">Login</h1>
                            <form onSubmit={handleSubmit}>

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
                                    placeholder="Password"
                                    className="input mt-5 input-bordered w-full max-w-xs"
                                    required
                                />
                                <br/>
                                <Link to="/forgot-password" className="text-sm text-start underline">Forgot Password?</Link>
                                <br/>
                                <input className="btn mt-7 w-full max-w-xs bg-slate-300" type="submit" value="LogIn" />
                            </form>

                            <h1 className=" ">Don&apos;t have any account? <Link className="underline" to='/signup'>Create account</Link></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login