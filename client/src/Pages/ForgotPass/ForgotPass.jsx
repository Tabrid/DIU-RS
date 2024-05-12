import { useState } from "react";

const ForgotPass = () => {
    const [username, setusername] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Username not found');
        })
        .then((data) => {
            console.log(data);
            setSubmitted(true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    };
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
                {submitted ? (
                    <p className="text-green-500 mb-4">Password reset instructions sent to your username.</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700 ">username</label>
                            <input
                                type="username"
                                id="username"
                                className="form-input mt-1 block w-full "
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setusername(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPass;