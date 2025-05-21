import { FastifyInstance } from 'fastify';
import { verifyToken } from '../middleware/auth';
import { 
  getAllTasks,
  getMyTasks,
  getSharedTasks, 
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  shareTask
} from '../controllers/tasks';

export default async function taskRoutes(fastify: FastifyInstance) {
  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', verifyToken);
  
  // Get tasks routes
  fastify.get('/', getAllTasks);
  fastify.get('/my-tasks', getMyTasks);
  fastify.get('/shared-tasks', getSharedTasks);
  
  // Task CRUD routes
  fastify.post('/', createTask);
  fastify.put('/:id', updateTask);
  fastify.patch('/:id/toggle', toggleTaskCompletion);
  fastify.delete('/:id', deleteTask);
  
  // Share task route
  fastify.post('/share', shareTask);
}