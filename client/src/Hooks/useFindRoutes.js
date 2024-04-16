const useFindRoutes = () => {
    const routes = async (formData) => {
        try {
            const response = await fetch('http://localhost:5000/api/data/findRoutes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
      
            if (!response.ok) {
              throw new Error('Failed to fetch direction route');
            }
      
            const data = await response.json();
            return data ; 
            
            // Handle success, such as showing a success message or redirecting
          } catch (error) {
            console.error('Error fetching direction route:', error);
            // Handle errors, such as showing an error message to the user
          }
    }
    return { routes }; // Return an object with routes function
};

export default useFindRoutes;
