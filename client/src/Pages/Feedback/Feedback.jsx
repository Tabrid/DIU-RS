
import img from '../../assets/login.svg'
function Feedback() {

  const data = Array.from({ length: 5 }, (_, index) => index + 1);
  return (
    <div>
      
      <div className='grid grid-cols-3'>
      {
          data.map((item) => (
            <div key={item} className="flex justify-between items-center p-4 border-b border-gray-200 w-96 gap-3">
              <div className='1/4'>
                  <img src={img} alt="" className='w-48 h-48 rounded-full'/>
              </div>
              <div className='3/4'>
                  <h1 className='text-2xl font-semibold'> Riyadh Mollik</h1>
                  <h1 className='mt-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit.  </h1>
                  <p className='mt-2'>4.5 out of 5</p>
              </div>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Feedback