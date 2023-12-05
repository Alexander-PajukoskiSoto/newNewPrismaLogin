const prisma = new PrismaClient()
const express = require('express');

const { PrismaClient } = require('@prisma/client');

const app = express();

app.use(express.json());
  
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  
