const prisma = new PrismaClient()
const express = require('express');

const { PrismaClient } = require('@prisma/client');

const app = express();

app.use(express.json());

async function main() {
    
      console.dir(allUsers, { depth: null })
      const post = await prisma.post.update({
        where: { id: 1 },
        data: { published: true },
      })
      console.log(post)
  }

  
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  
