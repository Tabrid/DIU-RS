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
      navigator.geolocation.getCurrentPosition((position) => {
        setViewport({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      });
    }, 1000);
  
  handleUpdateLocation();
    // Cleanup function to clear the interval when component unmounts or when dependency changes
    return () => clearInterval(interval);
    
  }, [viewport]); 
  
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
