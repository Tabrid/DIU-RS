// dataController.js
import { ObjectId } from "mongodb";
import User from "../models/user.model.js";
import SSLCommerzPayment from "sslcommerz-lts";
import Ride from "../models/ride.model.js";
const store_id = "cais661c139428107";
const store_passwd = "cais661c139428107@ssl";
const is_live = false;
import addresses from "../Data/address.json" assert { type: "json" };
import locations from "../Data/routes1.json" assert { type: "json" };
import locations2 from "../Data/routes1reverse.json" assert { type: "json" };
import locations3 from "../Data/routes2.json" assert { type: "json" };
import locations4 from "../Data/routes2reverse.json" assert { type: "json" };
export const fetchData = async (req, res) => {
  console.log(req.body);
  const { rider, selectedSeats } = req.body; // Extract selected seats from request body
  
  const transactionId = new ObjectId().toString();
  const data = {
    total_amount: 100,
    currency: "BDT",
    tran_id: "REF123", // use unique tran_id for each api call
    success_url: `http://localhost:5000/api/data/success?transactionId=${transactionId}`,
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  try {
    const user = await User.findById({ _id:rider });
    if (!user) {
      throw new Error('User not found');
    }
    console.log(user);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data); // Initialize payment

    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;

    // Create ride data
    const rideData = {
      transactionId,
      ...req.body,
      paid: false,
      user: req.user._id, // We will assign user ID after finding the user
    };

    // Find the user
    

    // Update seat availability
    user.seats.forEach(seat => {
      if (selectedSeats.includes(seat.sit)) {
        seat.available = false; // Assuming selectedSeats means the seats are no longer available
      }
    });

    // Save the updated user document
    await user.save();
    console.log(user);

    // Create ride record
    const ride = await Ride.create(rideData);

    if (ride) {
      res.send({ url: GatewayPageURL });
    }
  } catch (error) {
    console.error('Error in fetchData:', error.message);
    res.status(500).send({ error: 'Internal server error' });
  }
};

export const success = async (req, res) => {
  const { transactionId } = req.query;
  const updatedRide = await Ride.findOneAndUpdate(
    { transactionId: transactionId },
    { paid: true }
  );
  if (updatedRide) {
    res.redirect(
      `http://localhost:3000/start-ride?transactionId=${transactionId}`
    );
  }
};

export const addressSearch = async (req, res) => {
  const searchText = req.query.q;
  try {
    // Filter the addresses based on the search text
    const filteredAddresses = addresses.filter((address) =>
      address.location_name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Limit the number of results to 6
    const searchResult = filteredAddresses.slice(0, 6);

    res.json(searchResult);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const findRoutes = async (req, res) => {
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
  const totalDistance1 = calculateTotalDistanceBetweenPoints(
    startPoint1,
    destinationPoint1,
    locations
  );
  const totalDistance2 = calculateTotalDistanceBetweenPoints(
    startPoint2,
    destinationPoint2,
    locations2
  );
  const totalDistance3 = calculateTotalDistanceBetweenPoints(
    startPoint3,
    destinationPoint3,
    locations3
  );
  const totalDistance4 = calculateTotalDistanceBetweenPoints(
    startPoint4,
    destinationPoint4,
    locations4
  );
  const routePoints1 = findPointsBetween(
    startPoint1,
    destinationPoint1,
    locations
  );
  const routePoints2 = findPointsBetween(
    startPoint2,
    destinationPoint2,
    locations2
  );
  const routePoints3 = findPointsBetween(
    startPoint3,
    destinationPoint3,
    locations3
  );
  const routePoints4 = findPointsBetween(
    startPoint4,
    destinationPoint4,
    locations4
  );
  // Find the route with the smallest total distance
  const routes = [
    {
      route: [startPoint1, ...routePoints1, destinationPoint1],
      totalDistance: totalDistance1,
    },
    {
      route: [startPoint2, ...routePoints2, destinationPoint2],
      totalDistance: totalDistance2,
    },
    {
      route: [startPoint3, ...routePoints3, destinationPoint3],
      totalDistance: totalDistance3,
    },
    {
      route: [startPoint4, ...routePoints4, destinationPoint4],
      totalDistance: totalDistance4,
    },
  ];

  const shortestRoute = routes.reduce((min, current) =>
    current.totalDistance < min.totalDistance ? current : min
  );
  // const routeCoordinates = await getDirectionRoute(shortestRoute.route);

  res.json({ shortestRoute});
};

function findLocation(locationName, locations) {
  return locations.find(
    (location) =>
      location.location_name.toLowerCase() === locationName.toLowerCase()
  );
}

// Function to calculate the total distance between two points within a given set of locations
function calculateTotalDistanceBetweenPoints(
  startPoint,
  destinationPoint,
  locations
) {
  if (!startPoint || !destinationPoint) {
    return Infinity; // If start or destination location not found, return Infinity distance
  }
  const startIndex = locations.indexOf(startPoint);
  const destinationIndex = locations.indexOf(destinationPoint);
  // Find all points between start and destination
  const routePoints = findPointsBetween(
    startPoint,
    destinationPoint,
    locations
  );

  // Concatenate start, route points, and destination in the same array
  const route = [startPoint, ...routePoints, destinationPoint];

  // Calculate total distance excluding the 0 index distance
  const totalDistance = calculateTotalDistance(
    route,
    startIndex,
    destinationIndex
  );

  return totalDistance;
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
// const getDirectionRoute = async (locations) => {
//   const routeCoordinates = [];
//   try {
//     for (let i = 0; i < locations.length - 1; i++) {
//       const sourceCoordinates = {
//         lng: locations[i].longitude,
//         lat: locations[i].latitude,
//       };
//       const destinationCoordinates = {
//         lng: locations[i + 1].longitude,
//         lat: locations[i + 1].latitude,
//       };

//       const url = `${MAPBOX_DRIVING_ENDPOINT}${sourceCoordinates.lng},${sourceCoordinates.lat};${destinationCoordinates.lng},${destinationCoordinates.lat}?overview=full&geometries=geojson&access_token=${mapboxAccessToken}`;

//       const response = await fetch(url, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const result = await response.json();
//       const coordinates = result?.routes[0]?.geometry?.coordinates;
//       if (coordinates) {
//         console.log("Coordinates:", coordinates);
//         routeCoordinates.push(...coordinates);
//       }
//     }
//     console.log("Route Coordinates:", routeCoordinates);
//     return routeCoordinates;
//   } catch (error) {
//     console.error("Error fetching direction route:", error);
//     throw new Error("Error fetching direction route");
//   }
// };
