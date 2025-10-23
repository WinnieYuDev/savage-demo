const express = require('express')
const app = express()
const bodyParser = require('body-parser') //to help parse the body of the request
const MongoClient = require('mongodb').MongoClient //to connect to mongoDB

var db, collection;

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
const dbName = "demo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public')) //route everything in public folder to the app

app.get('/', (req, res) => { //load home page //refresh is a get request
  db.collection('messages').find().toArray((err, result) => { // turns all message in database into an array object
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result}) //feeds array into ejs template that spits out html with messages from db
  })
})

app.post('/messages', (req, res) => {
  //go into database collection and insert one document with name and msg from body of request (hard coded in form)
  db.collection('messages').insertOne({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/') //allows from messages from database and form to show on home page
  })
})

app.put('/messages', (req, res) => { console.log("Thumbs Up Before Response", req.body) 
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, 
  {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

//thumbs down solution
app.put('/messages/down', (req, res) => { console.log("Thumbs Down Before Response", req.body)
  db.collection('messages')
  .findOneAndUpdate({name: req.body.A, msg: req.body.B}, {
    $set: {
      thumbUp:req.body.C - 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  //find on and delete message with document that matches name and msg from request body
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  //should have a refresh to update with deletion
  })
})