const prisma = new PrismaClient()
const express = require('express');

const { PrismaClient } = require('@prisma/client');

const app = express();

app.use(express.json());

app.get('/')

async function main() {
    await prisma.user.create({
        data: {
          name: 'Alce',
          email: 'alice@prisa.io',
          posts: {
            create: { title: 'Hello Wrld' },
          },
          profile: {
            create: { bio: 'I like turles' },
          },
        },
      })
    
      const allUsers = await prisma.user.findMany({
        include: {
          posts: true,
          profile: true,
        },
      })
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
  
