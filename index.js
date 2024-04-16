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

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client" , "dist", "index.html"));
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


import locations from "./server/Data/routes1.json" assert { type: "json" };
import locations2 from "./server/Data/routes1reverse.json" assert { type: "json" };
import locations3 from "./server/Data/routes2.json" assert { type: "json" };
import locations4 from "./server/Data/routes2reverse.json" assert { type: "json" };

// Endpoint to handle user input for start and destination locations
app.post("/api/findRoute", async (req, res) => {
  const { startLocation, destinationLocation } = req.body;
  // Find the points for start and destination locations for each route
  const startPoint1 = findLocation(startLocation, locations);
  const destinationPoint1 = findLocation(destinationLocation, locations);
  const startPoint2 = findLocation(startLocation, locations2);
  const destinationPoint2 = findLocation(destinationLocation, locations2);
  const startPoint3 = findLocation(startLocation, locations3);
  const destinationPoint3 = findLocation(destinationLocation, locations3);
  const startPoint4 = findLocation(startLocation, locations4);
  const destinationPoint4 = findLocation(destinationLocation, locations4);

  // Calculate total distances for each route
  const totalDistance1 = calculateTotalDistanceBetweenPoints(startPoint1, destinationPoint1, locations);
  const totalDistance2 = calculateTotalDistanceBetweenPoints(startPoint2, destinationPoint2, locations2);
  const totalDistance3 = calculateTotalDistanceBetweenPoints(startPoint3, destinationPoint3, locations3);
  const totalDistance4 = calculateTotalDistanceBetweenPoints(startPoint4, destinationPoint4, locations4);
  const routePoints1 = findPointsBetween(startPoint1, destinationPoint1, locations);
  const routePoints2 = findPointsBetween(startPoint2, destinationPoint2, locations2);
  const routePoints3 = findPointsBetween(startPoint3, destinationPoint3, locations3);
  const routePoints4 = findPointsBetween(startPoint4, destinationPoint4, locations4);
  // Find the route with the smallest total distance
  const routes = [
    { route: [startPoint1, ...routePoints1, destinationPoint1], totalDistance: totalDistance1 },
    { route: [startPoint2,...routePoints2, destinationPoint2], totalDistance: totalDistance2 },
    { route: [startPoint3,...routePoints3, destinationPoint3], totalDistance: totalDistance3 },
    { route: [startPoint4,...routePoints4, destinationPoint4], totalDistance: totalDistance4 }
  ];

  const shortestRoute = routes.reduce((min, current) => current.totalDistance < min.totalDistance ? current : min);
  const routeCoordinates =await getDirectionRoute(shortestRoute.route);
  
  res.json({shortestRoute , routeCoordinates});
});

// Function to find a location by name within a given set of locations
function findLocation(locationName, locations) {
  return locations.find(
    (location) =>
      location.location_name.toLowerCase() === locationName.toLowerCase()
  );
}

// Function to calculate the total distance between two points within a given set of locations
function calculateTotalDistanceBetweenPoints(startPoint, destinationPoint, locations) {
  if (!startPoint || !destinationPoint) {
    return Infinity; // If start or destination location not found, return Infinity distance
  }
  const startIndex = locations.indexOf(startPoint);
  const destinationIndex = locations.indexOf(destinationPoint);
  // Find all points between start and destination
  const routePoints = findPointsBetween(startPoint, destinationPoint, locations);

  // Concatenate start, route points, and destination in the same array
  const route = [startPoint, ...routePoints, destinationPoint];

  // Calculate total distance excluding the 0 index distance
  const totalDistance = calculateTotalDistance(route , startIndex , destinationIndex);

  return totalDistance ;
}

// Function to find all points between start and destination within a given set of locations
function findPointsBetween(startPoint, destinationPoint, locations) {
  const startIndex = locations.indexOf(startPoint);
  const destinationIndex = locations.indexOf(destinationPoint);

  // Return empty array if start or destination point not found
  if (startIndex === -1 || destinationIndex === -1) {
    return [];
  }

  // Determine the indices of points between start and destination
  const startIndexInclusive = Math.min(startIndex, destinationIndex);
  const endIndexExclusive = Math.max(startIndex, destinationIndex);

  // Extract the points between start and destination
  let routePoints = locations.slice(startIndexInclusive + 1, endIndexExclusive);

  // If start point index is greater than destination point index, reverse the route points
  if (startIndex > destinationIndex) {
    routePoints = routePoints.reverse();
  }

  return routePoints;
}

// Function to calculate the total distance excluding 0 index distance
function calculateTotalDistance(routePoints, firstIndex, lastIndex) {
  if (firstIndex < lastIndex) {
    let totalDistance = 0;
    for (let i = 1; i < routePoints.length; i++) {
      console.log(routePoints[i].distance);
      totalDistance = totalDistance + parseFloat(routePoints[i].distance);
    }
    return totalDistance;
  } else {
    let totalDistance = 0;
    for (let i = routePoints.length - 2; i >= 0; i--) {
      console.log(routePoints[i].distance);
      totalDistance = totalDistance + parseFloat(routePoints[i].distance);
    }
    return totalDistance;
  }
}
const getDirectionRoute = async (locations) => {
  const routeCoordinates = [];
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
