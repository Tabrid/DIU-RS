import { Link } from 'react-router-dom';
import { userNav, adminNav, riderNav } from '../../Data/Data';
import { useAuthContext } from '../../Context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
const Home = () => {
    const { authUser } = useAuthContext();
    const [data, setData] = useState([]);
    useEffect(() => {
        if (authUser.role === 'User') {
            setData(userNav);
        } else if (authUser.role === 'Admin') {
            setData(adminNav);
        } else if (authUser.role === 'Rider') {
            setData(riderNav);
        }
    }, [authUser]);
    return (
        <div className="my-auto mt-10" >
            <div className="flex justify-center items-center">
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-10'>
                    {
                        data.map((item, index) => {
                            return (
                                <Link key={index} to={item.url}>
                                    <div className="lg:w-48 lg:h-48 border-none bg-white lg:bg-base-100 lg:shadow-xl btn flex-col w-40 h-40">
                                        <div><figure><img src={item.img} alt="Shoes" className='w-16 lg:w-20' /></figure></div>
                                        <div className="mx-auto">
                                            <h2 className="font-semibold text-xl text-center">{item.title}</h2>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    }
                </div>
            </div>
        </div>


    );
};

export default Home;
