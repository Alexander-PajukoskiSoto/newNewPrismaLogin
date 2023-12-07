const express = require('express');
const app = express();


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bodyPasrer = require('body-parser');
const mysql = require('mysql2')
const session = require('express-session');

app.use(session({
    secret: 'some secret',
    cookie: {maxAge: 10000},
    saveUninitialized: false
}))

app.use(express.json());

app.use(bodyPasrer.urlencoded({extended:true}));

app.use(express.static('public'));

var connection = mysql.createConnection({

    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tenta3'

  });

app.set('view engine','ejs');

app.get('/', async (req,res)=>{
    try {
        // const logon = await prisma.user.findMany();
        // res.json(logon);
       res.render('index',{pageName:"Create User"})
    } catch (error) {
        console.log(error);

        res.status(500).json({error:'error fetching login'});

    }
})
app.post('/', async (req,res)=>{
    try {
        const user = await prisma.User.create({
            data: {
              email: req.body.mail,
              username: req.body.username,
              shownName: req.body.shownName,
              password: req.body.password,
              admin: req.body.admin === "true" ? req.body.admin : "false"
            },
          })

        res.redirect('/');
        } catch (error) {
        console.log(error);
        res.status(500).json({error:'error fetching login'});
    }
})

app.get('/posts', async (req,res)=>{
  try {
    res.render('posts',{pageName:"Create User"})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'error fetching ligin'});
  }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});