import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";
import authRoutes from "./server/routes/auth.routes.js";
import userRoutes from "./server/routes/user.routes.js";
import applyRoutes from "./server/routes/apply.routes.js";
import rechargeRoutes from "./server/routes/recharge.routes.js";
import orderRoutes from "./server/routes/order.routes.js";
import noticeRoutes from "./server/routes/notice.routes.js";
import connectDB from "./server/DB/databaseConfigs.js";
import { uploder } from "./server/middleware/uploder.js";
import { v2 as cloudinary } from "cloudinary";
import dataRoutes from "./server/routes/api.routes.js";
import { uploadSingle } from "./server/middleware/uploadSingle.js";
import balanceRoutes from "./server/routes/balance.routes.js";
import rideRoutes from "./server/routes/ride.routes.js";
import ratingRoutes from "./server/routes/rating.routes.js";
import geolib from "geolib"
const app = express();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

dotenv.config();
app.use(cors());
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.post("/uploads", uploder.single("uploads"));
app.use("/api/apply", applyRoutes);
app.use("/api/order", uploder.single("file"), orderRoutes);
app.use("/api/recharge", rechargeRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/ride", rideRoutes);
app.use('/api/ratings', ratingRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.post("/upload", uploder.single("file"), uploadSingle, async (req, res) => {
  res.send(req.body);
});
app.get("/", (req, res) => {
  res.send("Hello to online API");
});
const MAPBOX_DRIVING_ENDPOINT = "https://api.mapbox.com/directions/v5/mapbox/driving/";
const mapboxAccessToken = "pk.eyJ1Ijoicml5YWRoMTgxMCIsImEiOiJjbHVmdzZtNXUwbm1tMmxvZXgxbTZkZTBzIn0.ZKL7nnBAQryksHFvmNl3YQ";


import location from "./server/Data/routes1.json" assert { type: "json" };
import locations2 from "./server/Data/routes1reverse.json" assert { type: "json" };
import locations3 from "./server/Data/routes2.json" assert { type: "json" };
import locations4 from "./server/Data/routes2reverse.json" assert { type: "json" };
import locations5 from "./server/Data/routes3.json" assert { type: "json" };
import locations6 from "./server/Data/routes3reverse.json" assert { type: "json" };



app.post('/api/findRoute', async (req, res) => {
  
  const { point1, point2,routes,map } = req.body;
  console.log(req.body);
  let locations =[];
  if (routes==1) {
    if (map=="forward") {
      locations = location; 
    } else if (map=="back"){
      locations = locations2
    } 
  }
  else if (routes==2) {
    if (map=="forward") {
      locations = locations3; 
    } else if (map=="back"){
      locations = locations4
    } 
  }
  else if (routes==2) {
    if (map=="forward") {
      locations = locations5; 
    } else if (map=="back"){
      locations = locations6
    } 
  }
  // Find details of two selected points
  const point1Details = locations.findIndex(point => point.location_name.toLowerCase() === point1.toLowerCase());
  const point2Details = locations.findIndex(point => point.location_name.toLowerCase() === point2.toLowerCase());
  console.log(point1Details, point2Details);
  // Check if both points are found
  if (point1Details === -1 || point2Details === -1) {
    console.log({ error: 'One or both points not found' });
    return res.status(404).json({ error: 'One or both points not found' });
    
}


  const pointsBetween = locations.slice(point1Details , point2Details +1);
  console.log(pointsBetween);
  const routeCoordinates =await getDirectionRoute(pointsBetween);
  let fair =0;
  if (pointsBetween.length <4) {
    fair=5
  } 
  else if(pointsBetween.length < 6) {
    fair = 10
  }
  else if(pointsBetween.length <9){
    fair = 15
  }
  else{
    fair = 20
  }
  res.json({
    points: pointsBetween,
    coordinates:routeCoordinates,
    fair:fair
  });
});

const getDirectionRoute = async (locations) => {
  console.log(locations);
  let routeCoordinates = [];
  try {
    for (let i = 0; i < locations.length - 1; i++) {
      const sourceCoordinates = {
        lng: locations[i].longitude,
        lat: locations[i].latitude
      };
      const destinationCoordinates = {
        lng: locations[i + 1].longitude,
        lat: locations[i + 1].latitude
      };

      const url = `${MAPBOX_DRIVING_ENDPOINT}${sourceCoordinates.lng},${sourceCoordinates.lat};${destinationCoordinates.lng},${destinationCoordinates.lat}?overview=full&geometries=geojson&access_token=${mapboxAccessToken}`;

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      const coordinates = result?.routes[0]?.geometry?.coordinates;
      if (coordinates) {
        console.log('Coordinates:', coordinates);
        routeCoordinates.push(...coordinates);
      }
    }
    console.log('Route Coordinates:', routeCoordinates);
    return routeCoordinates;
  } catch (error) {
    console.error('Error fetching direction route:', error);
    throw new Error('Error fetching direction route');
  }
};

app.listen(PORT, () => {
  connectDB();
  console.log(`Server Running on port ${PORT}`);
});
