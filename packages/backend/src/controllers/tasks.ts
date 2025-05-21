import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../index';

interface TaskBody {
  title: string;
  description?: string;
}

interface TaskParams {
  id: string;
}

interface ShareTaskBody {
  taskId: string;
  userEmail: string;
}

export const getAllTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = (request as any).user.userId;
    
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { userId },
          {
            sharedWith: {
              some: {
                id: userId
              }
            }
          }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        sharedWith: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return reply.send(tasks);
  } catch (error) {
    return reply.status(500).send({ message: 'Error retrieving tasks' });
  }
};

export const getMyTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = (request as any).user.userId;
    
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        sharedWith: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return reply.send(tasks);
  } catch (error) {
    return reply.status(500).send({ message: 'Error retrieving tasks' });
  }
};

export const getSharedTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = (request as any).user.userId;
    
    const tasks = await prisma.task.findMany({
      where: {
        sharedWith: {
          some: {
            id: userId
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        sharedWith: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return reply.send(tasks);
  } catch (error) {
    return reply.status(500).send({ message: 'Error retrieving tasks' });
  }
};

export const createTask = async (request: FastifyRequest<{ Body: TaskBody }>, reply: FastifyReply) => {
  try {
    const { title, description } = request.body;
    const userId = (request as any).user.userId;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        user: {
          connect: { id: userId }
        }
      }
    });
    
    return reply.status(201).send(task);
  } catch (error) {
    return reply.status(500).send({ message: 'Error creating task' });
  }
};

export const updateTask = async (request: FastifyRequest<{ Body: TaskBody, Params: TaskParams }>, reply: FastifyReply) => {
  try {
    const { id } = request.params;
    const { title, description } = request.body;
    const userId = (request as any).user.userId;
    
    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { userId },
          {
            sharedWith: {
              some: {
                id: userId
              }
            }
          }
        ]
      }
    });
    
    if (!existingTask) {
      return reply.status(404).send({ message: 'Task not found or unauthorized' });
    }
    
    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description
      }
    });
    
    return reply.send(task);
  } catch (error) {
    return reply.status(500).send({ message: 'Error updating task' });
  }
};

export const toggleTaskCompletion = async (request: FastifyRequest<{ Params: TaskParams }>, reply: FastifyReply) => {
  try {
    const { id } = request.params;
    const userId = (request as any).user.userId;
    
    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        OR: [
          { userId },
          {
            sharedWith: {
              some: {
                id: userId
              }
            }
          }
        ]
      }
    });
    
    if (!existingTask) {
      return reply.status(404).send({ message: 'Task not found or unauthorized' });
    }
    
    // Toggle completion status
    const task = await prisma.task.update({
      where: { id },
      data: {
        completed: !existingTask.completed
      }
    });
    
    return reply.send(task);
  } catch (error) {
    return reply.status(500).send({ message: 'Error updating task completion status' });
  }
};

export const deleteTask = async (request: FastifyRequest<{ Params: TaskParams }>, reply: FastifyReply) => {
  try {
    const { id } = request.params;
    const userId = (request as any).user.userId;
    
    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });
    
    if (!existingTask) {
      return reply.status(404).send({ message: 'Task not found or unauthorized' });
    }
    
    // Delete task
    await prisma.task.delete({
      where: { id }
    });
    
    return reply.send({ message: 'Task deleted successfully' });
  } catch (error) {
    return reply.status(500).send({ message: 'Error deleting task' });
  }
};

export const shareTask = async (request: FastifyRequest<{ Body: ShareTaskBody }>, reply: FastifyReply) => {
  try {
    const { taskId, userEmail } = request.body;
    const userId = (request as any).user.userId;
    
    // Check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      }
    });
    
    if (!existingTask) {
      return reply.status(404).send({ message: 'Task not found or unauthorized' });
    }
    
    // Find the user to share with
    const userToShare = await prisma.user.findUnique({
      where: { email: userEmail }
    });
    
    if (!userToShare) {
      return reply.status(404).send({ message: 'User not found' });
    }
    
    // Check if the task is already shared with the user
    const alreadyShared = await prisma.task.findFirst({
      where: {
        id: taskId,
        sharedWith: {
          some: {
            id: userToShare.id
          }
        }
      }
    });
    
    if (alreadyShared) {
      return reply.status(400).send({ message: 'Task already shared with this user' });
    }
    
    // Share task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        sharedWith: {
          connect: { id: userToShare.id }
        }
      },
      include: {
        sharedWith: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return reply.send(task);
  } catch (error) {
    return reply.status(500).send({ message: 'Error sharing task' });
  }
};