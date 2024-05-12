import { useEffect, useState } from "react";


function RiderInfo() {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('/api/users/rider')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData(data)
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });

    }, []);
    return (
        <div>
            <h1 className="text-xl font-semibold text-center my-3 ">Rider Information</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3">
                {data.map((item) => (
                    <div key={item._id} className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className=" flex gap-10">
                        <figure><img className="h-20 w-20 rounded-full" src={item.image} alt="Shoes" /></figure>
                        <p className="text-gray-500">
                            <strong>Name:</strong>{item.fullName}<br />
                            <strong>User Name:</strong>{item.username}<br />
                            <strong>Email:</strong>{item.email}<br />
                            <strong>Phone No:</strong>{item.phone}<br />
                            
                        </p>
                    </div>
                </div>
                ))}
            </div>

        </div>
    )
}

export default RiderInfo