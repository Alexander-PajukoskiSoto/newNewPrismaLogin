const express = require('express');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
let ejs = require('ejs');

const app = express();

app.use(express.json());


app.get('/', async (req,res)=>{
    try {
        const logon = await prisma.user.findMany();
        res.json(logon);
        res.sendFile(__dirname +'/index.html');
    } catch (error) {
        console.log(error);

        res.status(500).json({error:'error fetching login'});

    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});