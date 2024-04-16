const DistanceTravelled = () => {
    const stats = {
        totalDistance: 1500,
        joinDate: '2023-05-10',
        totalIncome: 500,
        numberOfTrips: 20,
        sharedTrips: 10,
        personalTrips: 10,
    };

    return (
        <div className="flex items-center justify-center">
            <div>
                <h1 className="text-3xl font-semibold mb-4 text-center">Travel Stats</h1>
                <div className="max-w-2xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg grid grid-cols-2 gap-14">
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <p className="mb-2"><span className="font-semibold">Total Traveled Distance:</span> {stats.totalDistance} km</p>
                    </div>
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <p className="mb-2"><span className="font-semibold">Join Date:</span> {stats.joinDate}</p>
                    </div>
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <p className="mb-2"><span className="font-semibold">Total Income:</span> {stats.totalIncome}tk</p>
                    </div>
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <p className="mb-2"><span className="font-semibold">Number of Trips:</span> {stats.numberOfTrips}</p>
                    </div>
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <p className="mb-2"><span className="font-semibold">Shared Trips:</span> {stats.sharedTrips}</p>
                    </div>
                    <div className="mb-4 border-b border-gray-300 pb-4">
                        <p className="mb-2"><span className="font-semibold">Personal Trips:</span> {stats.personalTrips}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistanceTravelled;
