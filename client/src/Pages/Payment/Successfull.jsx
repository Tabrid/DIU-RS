import { useLocation } from "react-router-dom";


const Successfull = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
  
    const transactionId = query.get("transactionId");
    console.log(transactionId);
    return (
        <div>
            <h1>Payment Successfull</h1>
            <h2>Transaction Id: {transactionId}</h2>
            <img src="https://i.ibb.co/JQVXYW5/undraw-Order-confirmed-re-g0if.png" alt="" />
        </div>
    );
};

export default Successfull;