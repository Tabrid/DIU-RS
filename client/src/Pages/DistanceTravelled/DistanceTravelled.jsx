import { useEffect, useState } from "react";

const DistanceTravelled = () => {
    const [user, setUser] = useState({})
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
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });

    }, []);
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    console.log(user);
    return (
        <div className="flex items-center justify-center">
            <div>
                <h1 className="text-3xl font-semibold mb-4 text-center">Travel Stats</h1>
                <div className="mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-14">
                    <div className="bg-blue-200 mb-4 border-b border-gray-300 pb-4 rounded-lg w-48 h-24 flex justify-center items-center">
                        <p className="mb-2 text-center"><span className="font-semibold">Total Traveled Distance: <br /> </span> {user.distance} km</p>
                    </div>
                    <div className="bg-green-200 mb-4 border-b border-gray-300 pb-4 rounded-lg w-48 h-24 flex justify-center items-center">
                        <p className="mb-2 text-center"><span className="font-semibold">Join Date: <br /> </span>{formatDate(user.createdAt)}</p>
                    </div>
                    <div className="bg-yellow-200 mb-4 border-b border-gray-300 pb-4 rounded-lg w-48 h-24 flex justify-center items-center">
                        <p className="mb-2 text-center"><span className="font-semibold">Total Income: <br /> </span> {user.totalIncome}tk</p>
                    </div>
                    <div className="bg-red-200 mb-4 border-b border-gray-300 pb-4 rounded-lg w-48 h-24 flex justify-center items-center">
                        <p className="mb-2 text-center"><span className="font-semibold">Number of Trips: <br /> </span> {user.shareTrips + user.personalTrips }</p>
                    </div>
                    <div className="bg-purple-200 mb-4 border-b border-gray-300 pb-4 rounded-lg w-48 h-24 flex justify-center items-center">
                        <p className="mb-2 text-center"><span className="font-semibold">Shared Trips: <br /> </span> {user.shareTrips}</p>
                    </div>
                    <div className="bg-indigo-200 mb-4 border-b border-gray-300 pb-4 rounded-lg w-48 h-24 flex justify-center items-center">
                        <p className="mb-2 text-center"><span className="font-semibold">Personal Trips: <br /> </span> {user.personalTrips}</p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default DistanceTravelled;
