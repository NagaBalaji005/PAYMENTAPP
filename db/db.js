const mongoose = require('mongoose');

function connectToDB() {
  mongoose.connect(process.env.DB_CONNECT,)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log("DB Connection Error:", err));
}

module.exports = connectToDB;
