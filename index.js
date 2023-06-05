const express = require('express');
const app =express()
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{
    res.send('Bestro bosss server is running');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njyz70v.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const menuCollection = client.db("bistroDB").collection("menu");
    const reviewsCollection = client.db("bistroDB").collection("reviews");
    const cartsCollection = client.db("bistroDB").collection("carts");

    app.get('/menu',async(req,res)=>{
   const result =await menuCollection.find().toArray();
   res.send(result);
   })
    app.get('/reviews',async(req,res)=>{
   const result =await reviewsCollection.find().toArray();
   res.send(result);
   })
    app.get('/menu',async(req,res)=>{
   const result =await menuCollection.find().toArray();
   res.send(result);
   })
  //  cart collection api
  app.get('/carts',async(req,res)=>{
    const email = req.query.email;
    if(!email){
      res.send([]);
    }
    const query = {email:email};
    const result = await cartsCollection.find(query).toArray();
    res.send(result);
  })
   app.post('/carts',async(req,res)=>{
    const item = req.body;
    console.log(item);
    const result = await cartsCollection.insertOne(item);
    res.send(result);
   })
  //  delet api
  app.delete('/carts/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await cartsCollection.deleteOne(query);
    res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})