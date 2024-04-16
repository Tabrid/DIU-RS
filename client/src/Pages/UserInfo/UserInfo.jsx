

function UserInfo() {
    const data = Array.from({ length: 5 }, (_, index) => index + 1);
  return (
    <div>
            <h1 className="text-xl font-semibold text-center my-3 ">User Information</h1>
            <div className="grid grid-cols-3">
                {data.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 border-b border-gray-200">
                        <div className=" flex gap-10">
                            <figure><img className="h-20 w-20 rounded-full" src="https://i.ibb.co/kKXVXF0/photo.jpg" alt="Shoes" /></figure>
                            <p className="text-gray-500">
                                <strong>Name:</strong> Jahid Al Hasan<br />
                                <strong>Total Rides:</strong> 200<br />
                                <strong>Total Expense:</strong> 5,00 tk<br />
                                <strong>Age:</strong> 21<br />
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
  )
}

export default UserInfo