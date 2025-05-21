import fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import { verifyToken } from './middleware/auth';

dotenv.config();

const server = fastify({
  logger: true
});

export const prisma = new PrismaClient();

server.register(cors, {
  origin: true,
  credentials: true
});


server.register(authRoutes, { prefix: '/api/auth' });
server.register(taskRoutes, { prefix: '/api/tasks' });

server.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    console.log(`Server is running on ${server.server.address()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();