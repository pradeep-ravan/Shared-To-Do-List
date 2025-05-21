import api from './api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  sharedWith: {
    id: string;
    name: string;
    email: string;
  }[];
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  title: string;
  description?: string;
}

export interface ShareTaskData {
  taskId: string;
  userEmail: string;
}

export const getAllTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyTasks = async () => {
  try {
    const response = await api.get('/tasks/my-tasks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSharedTasks = async () => {
  try {
    const response = await api.get('/tasks/shared-tasks');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (data: CreateTaskData) => {
  try {
    const response = await api.post('/tasks', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (id: string, data: UpdateTaskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleTaskCompletion = async (id: string) => {
  try {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const shareTask = async (data: ShareTaskData) => {
  try {
    const response = await api.post('/tasks/share', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};