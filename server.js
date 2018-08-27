const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const app = express();

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'lelia',
      password : '',
      database : 'smart-brain'
    }
  });

const database = {
    users: [
        {
            id: '123',
            name: 'username',
            email: 'username@email.com',
            password: 'nameofmydog',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'username2',
            email: 'username2@email.com',
            password: 'nameofmycat',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res)=> {
    res.send(database.users);
})

app.post('/signin',(req, res)=> {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
    
})

app.post('/register',(req, res)=> {
    const { name, email } = req.body;
   db('users')
    .returning('*')
    .insert({
       email: email,
       name: name,
       joined : new Date()
   })
    .then(response =>{
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
    
})

app.get('/profile/:id',(req, res)=> {
    const { id } = req.params;
    db.select('*').from('users').where({id})
      .then(user => {
        if (user.length){
            res.json(user[0])
        }else {
            res.status(400).json ('not found')
        }
    })
      .catch(err => res.status(400).json ('error getting user'))
})

app.put('/image', (req, res)=> {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entrie'))
})


app.listen(3000, () => {
    console.log('app is running on port 3000');
})



