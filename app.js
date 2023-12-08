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
//LOGIN
app.get('/login', async (req,res)=>{
  try {
    res.render('login',{pageName:"Login"})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'error fetching ligin'});
  }
})

app.post('/login',async(req,res)=>{

  const user = await prisma.user.findFirst({
    where: {
      OR:[{
        username: req.body.emailOrUName},
        {email: req.body.emailOrUName
      }]

  }})
  console.log(user);
  if(req.body.emailOrUName == '')
  {
    console.log('No susch username or email')
  }else if(req.body.password ==  user.password ){
    console.log('successfully logged in')
    res.redirect('/posts')
  }
  else{
    res.redirect('/login')
  }
})

app.get('/createPost', async (req,res)=>{
  res.render('createPost',{pageName: 'Create Post'})
  
})

app.post('/createPost', async (req,res)=>{
  const posts = await prisma.Post.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image
    },
  })
})

//POSTST
app.get('/posts', async (req,res)=>{
  res.render('posts',{pageName:"Posts"})
  const posts = await prisma.Post.findMany({
  })

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});