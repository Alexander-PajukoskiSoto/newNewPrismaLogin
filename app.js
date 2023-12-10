const express = require('express');
const app = express();


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bodyPasrer = require('body-parser');
const mysql = require('mysql2')
const session = require('express-session');
const cookieParser = require('cookie-parser')

app.use(session({
    secret: 'some secret',
    cookie: {maxAge: 10000},
    saveUninitialized: false,
    resave: false
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
  if(req.res.authenticated == true){
    res.redirect('/posts')
  }else{
  try {
    res.render('login',{pageName:"Login",loginAnswer:"Please login before using the site"})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'error fetching ligin'});
  }
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

  //If already logged in send to posts
  if(req.session.authenticated ==true){
    res.redirect('/posts')
  }
  //else, do login stuff  
  else{
    if(req.body.emailOrUName == '')
    {
      res.render('login',{loginAnswer:'No such username or email',pageName:"Login"})
    }else if(req.body.password ==  user.password ){
      console.log('successfully logged in')
      req.session.authenticated = true;
      console.log(req.session.authenticated)
      req.session.user={id:user.id,admin:user.admin};
      res.redirect('/posts')
    }
    else{
      res.render('login',{loginAnswer:'Wrong password',pageName:"Login"})
    }
  }
})

app.get('/createPost', async (req,res)=>{
  if(req.session.authenticated){
  res.render('createPost',{pageName: 'Create Post'})
  }
  else{
    res.redirect('/login')
  }
  
})

app.post('/createPost', async (req,res)=>{
  try {
  console.log(req.sessionID);

    const posts = await prisma.Post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        authorId: req.session.user.id
      },
    })
  } catch (error) {
    console.log(error);
  }
  
})

//POSTST
app.get('/posts', async (req,res)=>{
  if(req.session.authenticated){
  res.render('posts',{pageName:"Posts"})
  console.log(req.session.user.id);
  const posts = await prisma.Post.findMany({
  })
  }
  else{
    res.redirect('/login')
  }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});