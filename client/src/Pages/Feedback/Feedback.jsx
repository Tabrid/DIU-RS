import { useEffect, useState } from 'react';

function Feedback() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/ratings/user')
      .then((res) => res.json())
      .then((data) => {
        setData(data.ratings);
      })
      .catch((error) => console.log(error));
  }, []);
  
  return (
    <div>
      <div className='grid grid-cols-3'>
        {data.map((item, index) => (
          <div key={index} className="flex items-center p-4 border-b border-gray-200 w-96 gap-3">
            <div className='1/4'>
              <img src={item.riderId.image} alt="" className='w-24 h-24 rounded-full' />
            </div>
            <div className='3/4'>
              <h1 className='text-2xl font-semibold'>{item.riderId.fullName}</h1>
              <h1 className='mt-2'>{item.comment}</h1>
              <div className="rating">
                {[...Array(5)].map((_, idx) => (
                  <input
                    key={idx}
                    type="radio"
                    name={`rating-${index}`}
                    className="mask mask-star"
                    value={idx + 1}
                    checked={item.rating >= idx + 1}
                    readOnly
                    disabled
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feedback;
