const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
const cors = require('cors');
require('dotenv').config();


//Middle were ------------------------------------------
app.use(cors());
app.use(express.json());

//Port---------------------------------------------------
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ne473.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    try {
      const decodedUser = await admin.auth().verifyIdToken(idToken);
      req.decodedUserEmail = decodedUser.email;
    }
    catch {

    }
  }
  next();
}

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const database = client.db("personalService");
    const serviceCollection = database.collection("service");


    

   

    // single food  ---------------------------------
    app.post('/service', async (req, res) => {
      const serviceData = req.body;
      const result = await serviceCollection.insertOne(serviceData)
      res.send(result)
    });
    
    app.get("/service", async (req, res) => {
      const cursor = serviceCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    
      


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




//test get -----------------------------------------------
app.get('/', (req, res) => {
  res.send('connected');
})
// listening port -----------------------------------------
app.listen(port, () => {
  console.log('listening port', port);
});