import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface SignupBody {
  email: string;
  password: string;
  name: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const signup = async (request: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
  try {
    const { email, password, name } = request.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return reply.status(400).send({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h'
    });
    
    return reply.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    return reply.status(500).send({ message: 'Error signing up' });
  }
};

export const login = async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
  try {
    const { email, password } = request.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h'
    });
    
    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    return reply.status(500).send({ message: 'Error logging in' });
  }
};