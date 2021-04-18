const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser =require('body-parser');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT||4400;
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9e8bh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const serviceCollection = client.db("dayCare").collection("classes");
    const adminCollection = client.db("dayCare").collection("admins");
    const reviewCollection = client.db("dayCare").collection("reviews");
    const orderCollection = client.db("dayCare").collection("orders");
    console.log('successfully')

   
    app.get('/services', (req, res)=>{
      serviceCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents)
      })
    })

    app.get('/service/:id', (req, res)=>{
      serviceCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err, documents)=>{
        res.send(documents[0]);
      })
    })

    app.post('/addService', (req, res) =>{
        const service = req.body;
        serviceCollection.insertOne(service)
        .then(result =>{
            res.send(result)
        })
    })

    // # customar order

    app.post('/addOrder', (req, res)=>{
      const order = req.body;
      orderCollection.insertOne(order)
      .then(result =>{
        res.send(result.insertedCount > 0)
      })


    })
    app.get('/orders', (req, res)=>{
      orderCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents)
      })
    })

  //# Review

    app.get('/reviews', (req, res)=>{
      reviewCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents)
      })
    })

  app.post('/addReview', (req, res)=>{
    const review = req.body;
    reviewCollection.insertOne(review)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })

  })
// # Admin

  app.post('/addAdmin', (req, res)=>{
    console.log(req.body)
    const view = req.body;
    adminCollection.insertOne(view)
    .then(result=> {
      res.send(result)
    })
  })

app.post('/adminLevel', (req, res)=>{
  const email = req.body;
  serviceCollection.find({email:email})
    .toArray((err, admins)=>{
      res.send(admins.length > 0)
      })
  })
  
  app.delete('/delete/:id', (req, res)=>{
    serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
     .then(result =>{
        res.send(result.deletedCount > 0);
     })
  })

});
  
  app.listen(port, ()=>console.log('listening to', port))