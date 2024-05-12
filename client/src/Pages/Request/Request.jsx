import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Request() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    fetch('/api/ride/rider/share')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRequests(data.reverse());
        // Update the state with the data received
      })
      .catch((error) => {
        console.error('Error:', error);
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
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Ride Requests</h2>
      <div className='grid grid-cols-2 gap-10'>
        {requests.map((request, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Request #{index + 1}</h3>
            <p><strong>Pickup Location:</strong> {request.startLocationName}</p>
            <p><strong>Destination:</strong> {request.endLocationName}</p>
            <p><strong>Time:</strong> {formatDate(request.createdAt)}</p>
            <p><strong>Number of Passengers:</strong> {request.selectedSeats.length}</p>
            <p><strong>Contact:</strong> {request.user.phone}</p>
            <Link to={`/start-ride?transactionId=${request.transactionId}`} className="text-blue-500 underline">View Details</Link>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Request;
