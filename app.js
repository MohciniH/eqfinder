const express = require('express')
const MongoClient = require('mongodb').MongoClient

const app = express();
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Connexion à la base de données
const url = 'mongodb://mongo:27017'
const client = new MongoClient(url, { useUnifiedTopology: true })

client.connect()
  .then(() => {
    console.log('Connexion à la base de données réussie')
  })
  .catch(err => {
    console.log('Impossible de se connecter à la base de données :', err)
  })

// Route pour récupérer les données des seismes
app.get('/earthquakes', function(req, res) {
  const db = client.db('earthquake2023');
  console.log('user sur /earthquakes');

  db.collection('earthquakes').find().toArray()
  .then(function(results) {
    //console.log('Données des earthquakes transmises à la vue :', results);
    res.render('earthquakes', { earthquakes: results });
  })
  .catch(function(err) {
    console.error(err);
    res.send('Une erreur est survenue.');
  });
});

app.get('/earthquakes/:id', function(req, res) {
  const db = client.db('earthquake2023');
  const id = req.params.id;
  console.log('user sur /earthquakes/' + id);

  db.collection('earthquakes').findOne({id: id})
  .then(function(result) {
    console.log('Données de l\'earthquake transmises à la vue :', result);
    res.render('earthquake_details', { earthquake: result });
  })
  .catch(function(err) {
    console.error(err);
    res.send('Une erreur est survenue.');
  });
});

app.get('/test', function(req, res) {
  res.send('Ceci est un test');
});

app.get('/', function(req, res) {
  console.log('user sur /')
  res.sendFile(path.join(__dirname, 'index.html'));
  res.send('Hello World!');
})

// Lancement du serveur
app.listen(3000, function() {
  console.log('Le serveur est démarré sur le port 3000')
})
