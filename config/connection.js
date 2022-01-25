//connection using mongoClient
const { MongoClient } = require("mongodb");

const access = {
  db:null
}
//local database url
const url = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(url);

async function connectDB() {
  try {
      let connect = await client.connect();
      console.log('-----------------------database connected-------------------------')
      let db = connect.db("food_app");
      access.db = db;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  get : ()=> {
    return access.db
  }
};