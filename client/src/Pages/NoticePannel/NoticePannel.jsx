import { useEffect, useState } from "react";


function NoticePannel() {
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
      <div>
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

export default NoticePannel