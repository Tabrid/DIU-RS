import { RouterProvider } from "react-router-dom"
import { router } from "./Routes/Routes"
import{ Toaster } from 'react-hot-toast';
import { useState } from "react";
import { useEffect } from "react";
import { useAuthContext } from "./Context/AuthContext";
function App() {
  const { setLocation } = useAuthContext();
const [viewport, setViewport] = useState({
  lat: 0,
  lng: 0,
});

useEffect(() => {
  const interval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setViewport({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        // Handle errors, e.g., permission denied, position unavailable
      },
      {
        maximumAge: 30000, // Maximum age of cached position
        timeout: 1000,     // Timeout for getting a new position
        enableHighAccuracy: true // Use GPS for high accuracy
      }
    );
  }, 1000); // Update location every 5 seconds

    handleUpdateLocation();
  return () => clearInterval(interval);
}, [viewport]); // No dependencies, so it runs only once when mounted

  
  // Remove the empty dependency array to run the effect on every render
  const handleUpdateLocation = async () => {
    try {
      const response = await fetch(`/api/users/update-location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(viewport),
      });

      if (!response.ok) {
        throw new Error('Failed to update location');
      }

     
      // Handle success scenario, maybe show a success message
    } catch (error) {
      console.error('Error updating location:', error.message);
      // Handle error scenario, show an error message to the user
    }
  };
  return (
    <div className=" min-h-screen ">
       <Toaster/>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
