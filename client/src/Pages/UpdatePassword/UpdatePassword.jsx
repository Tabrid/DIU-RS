import toast from "react-hot-toast";
import { useState } from "react";

const UpdatePassword = () => {
    const [title, setTitle] = useState("");
    const [notice, setNotice] = useState("");

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            notice ,
            title
        };
    
        console.log(data);
    
        try {
            const response = await fetch('/api/notice/notices', {
                method: 'POST',
                body: JSON.stringify(data), // Convert data object to JSON
                headers: {
                    'Content-Type': 'application/json' // Specify content type as JSON
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to create notice');
            }
    
            toast.success("Notice Updated Successfully");
        } catch (error) {
            console.error('Error creating notice:', error);
            toast.error("Failed to create notice");
        }
    };
    
      

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleNoticeChange = (e) => {
        setNotice(e.target.value);
    };

    return (
        <div>
            <div className="max-w-md mx-auto mt-10 p-6 ">
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-semibold mb-2">Title:</label>
                        <input
                            type="text"
                            id="title"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-semibold mb-2">Notice:</label>
                        <textarea
                            id="newPassword"
                            className="w-full h-48 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={notice}
                            onChange={handleNoticeChange}
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

export default UpdatePassword
