const express = require('express');
const router = express.Router();
const db = require('../models');
const axios = require('axios');


router.get('/:idx', function(req, res) {
  // TODO: Get all records from the DB and render to view
  const pokemonUrl = `http://pokeapi.co/api/v2/pokemon/${req.params.idx}`;
  axios.get(pokemonUrl)
  .then(response=>{
    res.render('show', {pokemon: response.data})
    // res.render('/faves',
    // {pokemon: response.data})
    console.log(response.data)
  })
  .catch(err=>{
    console.log(err)
  });
})

// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
  // TODO: Get all records from the DB and render to view
  db.pokemon.findAll()
  .then(favorites => {
    res.render('/faves', {favorites: favorites});

  })
  .catch(err =>{
    console.log('You have an error: ', err)
  })
});

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) {
  console.log(req.body.name)
  // TODO: Get form data and add a new record to DB
  db.pokemon.findOrCreate({
    where: {name: req.body.name},
    defaults: {name: req.body.name}
  })
  .then(([created, wasCreated])=>{
    console.log('Created new fave')
    res.redirect('/pokemon')
    //res.render(created)
  })
  .catch(err =>{
    console.log('You got an error dummy: ', err)
  })
  // res.send(req.body)
});

module.exports = router;