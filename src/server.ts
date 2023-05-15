import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from 'zod'
import cors from '@fastify/cors'

const app = fastify()

async function init() {
  return await app.register(cors)
}

init()

const prisma = new PrismaClient()

app.get('/users', async () => {
  const users = await prisma.user.findMany()

  return { users }
})
app.post('/users', async (req, reply) => {
  const createUserSchema = z.object({
    email: z.string().email()
  })

  const { email } = createUserSchema.parse(req.body)

  await prisma.user.create({
    data: {
      email
    }
  })

  return reply.status(201).send()
})

app.get('/posts', async () => {
  const posts = await prisma.new.findMany()

  return {
    news: posts
  }
})

app.post('/posts', async (req, reply) => {
  const createPostSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    content: z.string(),
    image: z.string()
  })

  const { content, image, subtitle, title } = createPostSchema.parse(req.body)

  await prisma.new.create({
    data: {
      title,
      subtitle,
      content,
      image
    }
  })

  return reply.status(201).send()
})

app.listen({
  host: '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
  console.log('Http server running')
})