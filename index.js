const express = require("express")
const connectDB = require("./db/connectDB")
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser")
dotenv.config();
// const app = express();
const { app, server } = require('./socket/socket')
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
connectDB();
const cors = require("cors")

// yeh mera code hai
// app.use(
//     cors({
//         origin:"https://social-backend-6n19.onrender.com",
//     })
// )

// Yeh solution hai
// CORS configuration
const corsOptions = {
  origin: 'https://practice-iota-two.vercel.app', // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true, // Allow credentials if you are using cookies or other credentials
  preflightContinue: false, // Pass the OPTIONS request to the next middleware
  optionsSuccessStatus: 204 // Some browsers choke on 204, so this ensures success
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// Ensure the preflight OPTIONS request gets handled properly
app.options('*', cors(corsOptions)); // Preflight handling for all routes
// yeh tak aata hai solution

const cloudinary = require('cloudinary').v2

const userRoutes = require("./routes/userRoutes")
const postRoutes = require("./routes/postRoutes")
const messageRoutes = require("./routes/messageRoutes")


// cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


// routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)

const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>console.log(`server started at ${PORT}`))


