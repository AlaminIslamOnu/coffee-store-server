const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jhank.0gkcofh.mongodb.net/?retryWrites=true&w=majority&appName=Jhank`;
// const uri = "mongodb+srv://<db_username>:<db_password>@jhank.0gkcofh.mongodb.net/?retryWrites=true&w=majority&appName=Jhank";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeesDB").collection("coffees");
    const userCollection = client.db("coffeesDB").collection("user");
    // user related API
    /* 1 */ app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    /* 2 */ app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    /* 3 get specific user */

    /* 4 */ app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    /* 5 update specific info  */
    app.patch("/users", async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = {
        email: email
      };
      const updateDoc = {
        $set: {
          lastSignInTime: lastSignInTime
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //  app.patch('/users', async(req,res)=> {
    //     const {email,lastSignInTime}=req.body
    //     const filter = {email: email }
    //     const updateDoc = {
    //       $set : {
    //         lastSignInTime:new Date(lastSignInTime).toLocaleString("en-US", {
    //           timeZone: "Asia/Dhaka"
    //         })
    //       }
    //     }
    //     const result= await userCollection.updateOne(filter,updateDoc)
    //     res.send(result)
    //  })

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // find single product
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });

    app.post("/coffees", async (req, res) => {
      const coffeeData = req.body;
      const result = await coffeeCollection.insertOne(coffeeData);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedCoffee = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: updatedCoffee,
      };
      const result = await coffeeCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee server is getting hot");
});

app.listen(port, () => {
  console.log(`port is ok may be ${port}`);
});
