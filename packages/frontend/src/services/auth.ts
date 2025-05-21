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
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;
    
    // Create user in our backend
    const response = await api.post('/auth/signup', {
      email: data.email,
      password: data.password,
      name: data.name
    });
    
    // Store the token
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: LoginData) => {
  try {
    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;
    
    // Login to our backend
    const response = await api.post('/auth/login', {
      email: data.email,
      password: data.password
    });
    
    // Store the token
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Sign out from Firebase
    await firebaseSignOut(auth);
    
    // Remove token
    localStorage.removeItem('token');
    
    return true;
  } catch (error) {
    throw error;
  }
};