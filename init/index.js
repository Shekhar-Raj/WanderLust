const mongoose=require("mongoose");
const initData=require("./data.js")
const Listing=require("../models/listing.js")

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66c4cd78c9a017e9590d59e1"}));
    await Listing.insertMany(initData.data);
    console.log("data was Initialized");
};

initDB();




// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// //Basics Connection with DB
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to database");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// //Initialize Databae
// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//     owner: "669f4f65cf1e4e7bccf0aee5",
//   }));
//  initData.data = initData.data.map((obj) => ({ ...obj, geometry: { type: 'Point', coordinates: [ 77.209006, 28.613895 ] },}))
 
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();