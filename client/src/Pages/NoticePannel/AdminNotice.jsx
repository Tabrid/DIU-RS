import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminNotice() {
  const [data, setData] = useState([]);
  useEffect(() => {
      fetch('/api/notice/notices')
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
        <Link to='/new-notice'><h1 className="text-2xl font-semibold text-center my-5 ">Add New Notice</h1></Link>
        <div  className="grid grid-cols-2">
            {
                data.map((item) => (
                    <div key={item} className="flex justify-between items-center p-4 border-b border-gray-200">
                      <div>
                        <h1 className="text-xl font-semibold">{item.title}</h1>
                        <p className="text-gray-500">
                          {item.notice}
                        </p>
                      </div>
        
                    </div>
                  ))
            }
        </div>
    </div>
  )
}

export default AdminNotice