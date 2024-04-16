

function NoticePannel() {
  const data = Array.from({ length: 5 }, (_, index) => index + 1);
  return (
    <div>
      <div>
        {
          data.map((item) => (
            <div key={item} className="flex justify-between items-center p-4 border-b border-gray-200">
              <div>
                <h1 className="text-xl font-semibold">Important Notice for Riders</h1>
                <p className="text-gray-500">
                  Dear riders, please be informed that there will be scheduled maintenance on our platform
                  tomorrow from 12:00 PM to 3:00 PM. During this time, you may experience intermittent
                  service disruptions. We apologize for any inconvenience caused and appreciate your
                  understanding.
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