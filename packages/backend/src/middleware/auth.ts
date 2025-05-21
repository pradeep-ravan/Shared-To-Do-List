import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

// Extend FastifyRequest to include the user property
interface CustomRequest extends FastifyRequest {
  user?: {
    userId: string;
  };
}

export const verifyToken = async (request: CustomRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return reply.status(401).send({ message: 'Unauthorized: Token not provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    request.user = { userId: decoded.userId };
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized: Invalid token' });
  }
};