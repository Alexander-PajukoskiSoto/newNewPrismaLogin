const express = require('express');
const app = express();


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bodyPasrer = require('body-parser');

app.use(express.json());

app.use(bodyPasrer.urlencoded({extended:true}));

app.set('view engine','ejs');

app.get('/', async (req,res)=>{
    try {
        // const logon = await prisma.user.findMany();
        // res.json(logon);
       res.render('index',{Cool:"dkohajdlka"})
    } catch (error) {
        console.log(error);

        res.status(500).json({error:'error fetching login'});

    }
})
app.post('/', async (req,res)=>{
    try {
        console.log(req.body);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'error fetching login'});
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});