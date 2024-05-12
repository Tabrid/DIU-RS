import {
  createBrowserRouter,
} from "react-router-dom";
import Login from "../Pages/Login/Login";
import Signup from "../Pages/Signup/Signup";
import PrivateRoute from "./PrivateRoutes";
import Home from "../Pages/Home/Home";
import Main from "../Layout/Main";
import UpdatePassword from "../Pages/UpdatePassword/UpdatePassword";
import MyProfile from "../Pages/MyProfile/MyProfile";
import ShareRide from "../Pages/ShareRide/ShareRide";
import PersonalRide from "../Pages/PersonalRide/PersonalRide";
import NoticePannel from "../Pages/NoticePannel/NoticePannel";
import HealthStatus from "../Pages/HealthStatus/HealthStatus";
import FeedBack from "../Pages/Feedback/Feedback";
import GetOffer from "../Pages/GetOffer/GetOffer";
import ActiveCar from "../Pages/ActiveCar/ActiveCar";
import AdminNotice from "../Pages/NoticePannel/AdminNotice";
import RiderInfo from "../Pages/RiderInfo/RiderInfo";
import UserInfo from "../Pages/UserInfo/UserInfo";
import BatteryStatus from "../Pages/BatteryStatus/BatteryStatus";
import RoadMap from "../Pages/RoadMap/RoadMap";
import RidderBattery from "../Pages/RiderBattery/RidderBattery";
import DistanceTravelled from "../Pages/DistanceTravelled/DistanceTravelled";
import Request from "../Pages/Request/Request";
import PersonalService from "../Pages/PersonalService/PersonalService";
import Failed from "../Pages/Payment/Failed";
import Successfull from "../Pages/Payment/Successfull";
import StartRide from "../Pages/StartRide/StartRide";
import ForgotPass from "../Pages/ForgotPass/ForgotPass";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";



export const router = createBrowserRouter([
  {
    path: "/",
    element:<PrivateRoute><Main /></PrivateRoute>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/new-notice",
        element: <UpdatePassword />,
      },
      {
        path: "/profile",
        element: <MyProfile />,
      }
      ,
      
      {
        path: "/share-ride",
        element: <ShareRide />,
      },
      {
        path: "/personal-ride",
        element: <PersonalRide/>  ,
      },
      {
        path: "/notice-panel",
        element: <NoticePannel/>  ,
      },
      {
        path: "/health-status",
        element: <HealthStatus/> ,
      },
      {
        path: "/feed-back",
        element: <FeedBack/> ,
      },
      {
        path: "/get-offer",
        element: <GetOffer/> ,
      },
      {
        path: "/active-car",
        element: <ActiveCar/> ,
      },
      {
        path: "/admin-notice",
        element: <AdminNotice/> ,
      },
      {
        path: "/rider-info",
        element: <RiderInfo/> ,
      },
      {
        path: "/user-info",
        element: <UserInfo/> ,
      },
      {
        path: "/battery-status",
        element: <BatteryStatus/> ,
      },
      {
        path: "/road-map",
        element: <RoadMap/> ,
      },
      {
        path: "/rider-battery",
        element: <RidderBattery/> ,
      },
      {
        path: "/distance-travelled",
        element: <DistanceTravelled/> ,
      },
      {
        path: "/request",
        element: <Request/> ,
      },
      {
        path: "/personal-service",
        element: <PersonalService/> ,
      },
      {
        path: "/payment-failed",
        element: <Failed />,
      },
      {
        path: "/payment-successful",
        element: <Successfull />,
      },
      {
        path: "/start-ride",
        element: <StartRide />,
      },


    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup/>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPass/> ,
  },
  {
    path: "/reset/:token",
    element: <ResetPassword/> ,
  },



]);
