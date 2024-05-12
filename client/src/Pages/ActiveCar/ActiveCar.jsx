

function ActiveCar() {
    const data = Array.from({ length: 5 }, (_, index) => index + 1);
    return (
        <div className="flex justify-center items-center my-5 ">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {
                    data.map((item) => (
                        <div key={item} className="card w-48 bg-base-100 shadow-xl">
                            <figure><img src="https://i.ibb.co/b1vHnHL/image.png" alt="Shoes" /></figure>
                            <div className="card-body">
                                <h2 className="card-title">No : 0{item}</h2>
                                <p>Charge : 90%</p>
                                
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ActiveCar