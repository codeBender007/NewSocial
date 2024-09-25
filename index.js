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
app.use(
    cors({
        origin:"https://new-social-frontend-4sxr.vercel.app",
    })
)

// const corsOptions = {
//   origin: 'https://new-social-frontend-4sxr.vercel.app', // Your updated frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

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


