import { useEffect, useState } from "react";
import { useAuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";
const MyProfile = () => {
    const { refresh, setBalance } = useAuthContext();
    const [user, setUser] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    useEffect(() => {
            fetch('/api/users/userInfo')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setUser(data.user);
                setBalance(data.user.balance);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
        
    }, [refresh, setBalance]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            const data = await response.json();
            console.log(data);
            toast.success(data.message);
        } catch (error) {
            console.error('Error updating password:', error.message);
            toast.error('Something went wrong!');
        }
    };

    return (
        <div>
            {user ? (
                <div className="w-full flex justify-center my-10">
                    <div className="flex flex-col justify-center items-center  overflow-hidden">
                        <img className="h-36 w-36 object-cover rounded-full" src={user.image} alt="User Profile" />
                        <div className="px-6 py-4 grid grid-cols-2 gap-5 w-full">
                        <input value={user.fullName} type="text" placeholder="Type here" className="input input-bordered w-full " />
                        <input value={user.username} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                        <input value={user.phone} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                        <input value={user.email} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                        <input value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)} type="text" placeholder="Old Password" className="input input-bordered w-full max-w-xs"  />
                        <input value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} type="text" placeholder="New Password" className="input input-bordered w-full max-w-xs" />    
                        </div>
                        <button className="btn w-full max-w-md" onClick={handleFormSubmit}>Update</button>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MyProfile;
