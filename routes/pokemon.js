const express = require('express');
const router = express.Router();
const db= require('../models');
//const { default: Axios } = require('axios');
const axios= require('axios');

const helper= require('../helpers');


// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
  // TODO: Get all records from the DB and render to view
  db.pokemon.findAll()
  .then(foundMons=> {
    //console.log('here are the users: ', foundMons);
    res.render('favorite', {favList: foundMons, fxn: helper}); //pass the helper with ejs render
  })
  
});

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) {
  
  db.pokemon.findOrCreate({
    where: {name: req.body.name}
  })
  .then(([foundOrCreatedMon, created])=> {
    console.log('the pokemon existed', !created);
    
    res.redirect('/pokemon');
  })
});


router.get('/:id', (req, res)=> {
 
  db.pokemon.findOne({
    where: {id: req.params.id}
  })
  .then(foundMon=> {
    
    console.log(foundMon.name);
    axios.get(`https://pokeapi.co/api/v2/pokemon/${foundMon.name.toLowerCase()}`)
    .then(response=> {
      
      res.render('show', {monId: req.params.id, monName: foundMon.name, monData: response.data, fxn: helper}); //pass the helper with ejs render
    })
    .catch(err=> {
      console.log('axios.then error: ', err);
    })
  })
  .catch(error=> {
    console.log('db.then error: ', error);
  })
})

//delete route 
router.delete('/:id', (req, res)=> {
  db.pokemon.destroy({
    where: {id: req.params.id}
  })
  .then(removedRows=> {
    console.log(removedRows, ' row(s) was removed');
    res.redirect('/pokemon');
  })
})

module.exports = router;