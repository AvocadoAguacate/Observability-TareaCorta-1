const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.urlencoded({ extended: false });
const mongoose = require('mongoose');
const kittySchema = new mongoose.Schema({
  name: String
});
const Kitten = mongoose.model('Kitten', kittySchema);

//get all cats
router.get('/mongo/', (req,res) => {
  let db = mongoose.connect('mongodb://localhost:27017/?directConnection=true', {dbName: "testing_database"})
    .catch(error => console.log(error));
  const silence = new Kitten({ name: 'Silence' });
  Kitten.find({}, function(err,docs){
    res.send(docs)
  });
});
//get cat by name
router.get('/mongo/id', jsonParser, (req,res) => {
  let db = mongoose.connect('mongodb://localhost:27017/?directConnection=true', {dbName: "testing_database"})
    .catch(error => console.log(error));
  Kitten.find({name: req.body.name}, function(err,docs){
    res.send(docs)
  });
});
//new cat
router.post('/mongo/',jsonParser,(req,res) => {
  let db = mongoose.connect('mongodb://localhost:27017/?directConnection=true', {dbName: "testing_database"})
    .catch(error => console.log(error));
  let newCat = new Kitten({name: req.body.name});
  newCat.save();
  res.send("ok");
});

//update cat name
router.put('/mongo/id',jsonParser, (req,res) => {
  let db = mongoose.connect('mongodb://localhost:27017/?directConnection=true', {dbName: "testing_database"})
    .catch(error => console.log(error));
  const filter = { name: req.body.name };
  const update = { name: req.body.name };
  Kitten.findOneAndUpdate(filter, update);
  res.send('ok')
});
//delete cat
router.delete('/mongo/id',jsonParser, (req,res) => {
  let db = mongoose.connect('mongodb://localhost:27017/?directConnection=true', {dbName: "testing_database"})
    .catch(error => console.log(error));
  const filter = { name: req.body.name };
  Kitten.findOneAndDelete(filter,(err, docs) => {
    if(!err){
      res.send('Ok')
    }
    res.send(err)
  })
})

module.exports = router;