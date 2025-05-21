import api from './api';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../firebase/config';

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;
    
    const response = await api.post('/auth/signup', {
      email: data.email,
      password: data.password,
      name: data.name
    });
    
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: LoginData) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;
    
    const response = await api.post('/auth/login', {
      email: data.email,
      password: data.password
    });
    
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    
    localStorage.removeItem('token');
    
    return true;
  } catch (error) {
    throw error;
  }
};