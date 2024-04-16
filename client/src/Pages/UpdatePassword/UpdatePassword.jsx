
import toast from "react-hot-toast";

const UpdatePassword = () => {

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        toast.success("Notice Updated Successfully");
    };
    return (
        <div>
            <div className="max-w-md mx-auto mt-10 p-6 ">
                
                <form onSubmit={handleFormSubmit}>
                    
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-semibold mb-2">New Notice:</label>
                        <textarea
                            type="password"
                            id="newPassword"
                            className="w-full h-48 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                        New Notice
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;