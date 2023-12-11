const express = require('express');
const app = express();


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bodyPasrer = require('body-parser');
const mysql = require('mysql2');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const url = require('url');

const storage = multer.diskStorage({
  destination:( req, file, cb) => {
    cb(null, (__dirname+'/image/'))
  },
  filename:(req,file,cb)=>{
    cb(null, file.originalname)
  }
})
const upload = multer({storage:storage})
const day = 1000 * 60 * 60 * 24;
app.use(session({
    secret: 'some secret',
    cookie: {maxAge: day},
    saveUninitialized: false,
    resave: false
}))

app.use(express.json());

app.use(bodyPasrer.urlencoded({extended:true}));

app.use(express.static('public'));
app.use('/public',express.static('public'));//idk^
app.use('/image', express.static('image'));  
app.use('/public/image/',express.static('/public/image'));


var connection = mysql.createConnection({

    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tenta3'

  });

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', async (req,res)=>{
    try {
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
  if(req.session.authenticated){
    res.redirect('/posts');
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
    if(req.body.emailOrUName == '')
    {
      res.render('login',{loginAnswer:'No such username or email',pageName:"Login"})
    }else if(req.body.password ==  user.password ){
      console.log('successfully logged in')
      req.session.authenticated = true;
      console.log(`AUTH ${req.session.authenticated}`)
      req.session.user={id:user.id,admin:user.admin};
      res.redirect('/posts')
    }
    else{
      res.render('login',{loginAnswer:'Wrong password',pageName:"Login"})
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

app.post('/createPost',upload.single('image'), async (req,res)=>{
  try {
  console.log(req.sessionID);
  console.log(req.session.user.id);
try {
  const posts = await prisma.Post.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      authorId: req.session.user.id,
      image: req.file ? req.file.filename : ''
    },
  })
  res.redirect('/posts')
} catch (error) {
  console.log(error);
}
    
  } catch (error) {
    console.log(error);
  }
  
})

//POSTST
app.get('/posts', async (req,res)=>{
  const posts = await prisma.Post.findMany({
    where: {
      published:false
  }})
  let postList = [];
  posts.forEach((element,index) => {
    postList.push(element);
  });

  if(req.session.authenticated){
  res.render('posts',{pageName:"Posts", postList:postList, admin:req.session.user.admin})
  console.log(req.session.user.id);
  const posts = await prisma.Post.findMany({
  })
  }
  else{
    res.redirect('/login')
  }
})

app.get('/edit', async(req, res) => {
  const post = await prisma.Post.findFirst({
    where: {
      id:Number(req.query.id)
  }})
  let postObject = post;
  res.render('edit',{pageName:'Edit', postObject:postObject})
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});