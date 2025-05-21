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
  fastify.addHook('preHandler', verifyToken);
  
  fastify.get('/', getAllTasks);
  fastify.get('/my-tasks', getMyTasks);
  fastify.get('/shared-tasks', getSharedTasks);
  
  fastify.post('/', createTask);
  fastify.put('/:id', updateTask);
  fastify.patch('/:id/toggle', toggleTaskCompletion);
  fastify.delete('/:id', deleteTask);
  
  fastify.post('/share', shareTask);
}