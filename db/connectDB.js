const mongoose = require("mongoose");

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);

        console.log("mongodb connect.");
    }
    catch(err){
        console.log("DB connect error : ",err)
        process.exit(1);
    }
}
module.exports = connectDB;