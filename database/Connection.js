// const mongoose = require("mongoose");
// const env = require("dotenv");
// const initAdminUser = require('../initAdminUser');
// env.config();
// const dbconnection = async () => {
 
//     mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//   })
//   .then(() => {
//       console.log('MongoDB connected');
//       // Initialize admin user
//       return initAdminUser();
//   }).catch(error => {
//     console.log("DB connection failed",error);
//   })

  
// };
// module.exports = dbconnection;