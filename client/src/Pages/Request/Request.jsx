import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Request() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    fetch('/api/ride/rider/share')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRequests(data);
        // Update the state with the data received
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Ride Requests</h2>
      <div className='grid grid-cols-2 gap-10'>
        {requests.map((request, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Request #{index + 1}</h3>
            <p><strong>User:</strong> {request.user}</p>
            <p><strong>Pickup Location:</strong> {request.pickupLocation}</p>
            <p><strong>Destination:</strong> {request.destination}</p>
            <p><strong>Time:</strong> {request.time}</p>
            <p><strong>Number of Passengers:</strong> {request.passengers}</p>
            <p><strong>Special Requests:</strong> {request.specialRequests}</p>
            <p><strong>Contact:</strong> {request.contact}</p>
            <Link to={`/start-ride?transactionId=${request.transactionId}`} className="text-blue-500 underline">View Details</Link>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Request;
