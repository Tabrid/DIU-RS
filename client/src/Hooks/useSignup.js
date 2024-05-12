import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const navigate = useNavigate();

    const signup = async ({ fullName, username, email, password, confirmPassword, role, image }) => {
        const success = handleInputErrors({ fullName, username, email, password, confirmPassword, role, imaged });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, username, email, password, confirmPassword, role, image }),
            });
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            toast.success('Successfully signed up!')
            localStorage.setItem("cais-user", JSON.stringify(data));
            setAuthUser(data);
            navigate("/");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullName, username, email, password, confirmPassword, role, image }) {
    if (!fullName ||  !username || !email || !password || !confirmPassword || !role || !image) {
        toast.error("Please fill in all fields");
        return false;
    }
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }
    return true;
}
