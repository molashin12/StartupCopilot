import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

// Firebase connection error class
export class FirebaseConnectionError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FirebaseConnectionError';
  }
}

// Helper function to check Firebase availability
function ensureFirebaseConnection(): void {
  if (!isFirebaseConfigured || !db) {
    throw new FirebaseConnectionError(
      'Firebase is not properly configured. Please check your environment variables and Firebase setup.',
      'firebase-not-configured'
    );
  }
}

// Enhanced error handler for Firebase operations
function handleFirebaseError(error: any): never {
  console.error('Firebase operation error:', error);
  
  // Handle specific Firebase errors
  if (error.code === 'unavailable') {
    throw new FirebaseConnectionError(
      'Firebase service is temporarily unavailable. Please try again in a moment.',
      'service-unavailable'
    );
  }
  
  if (error.code === 'permission-denied') {
    throw new FirebaseConnectionError(
      'Access denied. Please check your authentication and permissions.',
      'permission-denied'
    );
  }
  
  if (error.code === 'unauthenticated') {
    throw new FirebaseConnectionError(
      'Authentication required. Please sign in again.',
      'unauthenticated'
    );
  }
  
  // Handle network and connection errors
  if (error.message?.includes('network') || 
      error.message?.includes('fetch') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError')) {
    throw new FirebaseConnectionError(
      'Network connection error. Please check your internet connection and try again.',
      'network-error'
    );
  }
  
  // Handle 400 Bad Request / Unknown SID errors
  if (error.message?.includes('400') || 
      error.message?.includes('Bad Request') ||
      error.message?.includes('Unknown SID') ||
      error.message?.includes('gsessionid')) {
    throw new FirebaseConnectionError(
      'Session expired or invalid. The page will refresh to restore connection.',
      'session-invalid'
    );
  }
  
  // Handle quota exceeded errors
  if (error.code === 'resource-exhausted') {
    throw new FirebaseConnectionError(
      'Firebase quota exceeded. Please try again later.',
      'quota-exceeded'
    );
  }
  
  // Generic Firebase error
  if (error.name === 'FirebaseError') {
    throw new FirebaseConnectionError(
      `Firebase error: ${error.message}`,
      error.code || 'firebase-error'
    );
  }
  
  // Re-throw if already a FirebaseConnectionError
  if (error instanceof FirebaseConnectionError) {
    throw error;
  }
  
  // Generic error fallback
  throw new FirebaseConnectionError(
    'An unexpected error occurred. Please try again.',
    'unknown-error'
  );
}

// Generic types for better type safety
export interface BaseDocument {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface StartupData extends BaseDocument {
  name: string;
  description: string;
  industry: string;
  stage: 'idea' | 'mvp' | 'growth' | 'scale';
  founderId: string;
  teamSize: number;
  funding?: {
    amount: number;
    round: string;
    investors?: string[];
  };
  metrics?: {
    revenue?: number;
    users?: number;
    growth?: number;
  };
}

export interface ConsultationData extends BaseDocument {
  startupId: string;
  consultantId: string;
  title: string;
  description: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  scheduledAt?: Timestamp;
  duration?: number; // in minutes
  notes?: string;
  recommendations?: string[];
}

export interface UserProfile extends BaseDocument {
  uid: string;
  email: string;
  displayName: string;
  role: 'founder' | 'consultant' | 'admin';
  bio?: string;
  expertise?: string[];
  experience?: string;
  linkedIn?: string;
  twitter?: string;
}

export interface ProjectData extends BaseDocument {
  name: string;
  description: string;
  userId: string;
  progress: number;
  status: 'draft' | 'in-progress' | 'completed';
  type: 'business-plan' | 'pitch-deck' | 'market-analysis' | 'competitor-research' | 'financial-projections' | 'swot-analysis' | 'risk-assessment' | 'idea-validation' | 'content-generation';
  tags: string[];
  lastModified?: Timestamp;
  content?: {
    sections?: Record<string, any>;
    data?: Record<string, any>;
  };
}

// Generic CRUD operations
export class FirebaseService {
  // Create a new document
  static async create<T extends BaseDocument>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      ensureFirebaseConnection();
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db!, collectionName), docData);
      return docRef.id;
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  // Read a single document
  static async getById<T extends BaseDocument>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    try {
      ensureFirebaseConnection();
      const docRef = doc(db!, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  // Read multiple documents with optional filters
  static async getMany<T extends BaseDocument>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      ensureFirebaseConnection();
      const q = query(collection(db!, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  // Update a document
  static async update<T extends BaseDocument>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      ensureFirebaseConnection();
      const docRef = doc(db!, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  // Delete a document
  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      ensureFirebaseConnection();
      const docRef = doc(db!, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirebaseError(error);
    }
  }
}

// Specific service methods for the startup copilot app
export class StartupService {
  private static readonly COLLECTION = 'startups';

  static async createStartup(data: Omit<StartupData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirebaseService.create<StartupData>(this.COLLECTION, data);
  }

  static async getStartup(id: string): Promise<StartupData | null> {
    return FirebaseService.getById<StartupData>(this.COLLECTION, id);
  }

  static async getStartupsByFounder(founderId: string): Promise<StartupData[]> {
    return FirebaseService.getMany<StartupData>(this.COLLECTION, [
      where('founderId', '==', founderId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async updateStartup(id: string, data: Partial<StartupData>): Promise<void> {
    return FirebaseService.update<StartupData>(this.COLLECTION, id, data);
  }

  static async deleteStartup(id: string): Promise<void> {
    return FirebaseService.delete(this.COLLECTION, id);
  }
}

export class ConsultationService {
  private static readonly COLLECTION = 'consultations';

  static async createConsultation(data: Omit<ConsultationData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirebaseService.create<ConsultationData>(this.COLLECTION, data);
  }

  static async getConsultation(id: string): Promise<ConsultationData | null> {
    return FirebaseService.getById<ConsultationData>(this.COLLECTION, id);
  }

  static async getConsultationsByStartup(startupId: string): Promise<ConsultationData[]> {
    return FirebaseService.getMany<ConsultationData>(this.COLLECTION, [
      where('startupId', '==', startupId),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getConsultationsByConsultant(consultantId: string): Promise<ConsultationData[]> {
    return FirebaseService.getMany<ConsultationData>(this.COLLECTION, [
      where('consultantId', '==', consultantId),
      orderBy('scheduledAt', 'desc')
    ]);
  }

  static async updateConsultation(id: string, data: Partial<ConsultationData>): Promise<void> {
    return FirebaseService.update<ConsultationData>(this.COLLECTION, id, data);
  }
}

export class UserService {
  private static readonly COLLECTION = 'users';

  static async createUserProfile(data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return FirebaseService.create<UserProfile>(this.COLLECTION, data);
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const profiles = await FirebaseService.getMany<UserProfile>(this.COLLECTION, [
      where('uid', '==', uid),
      limit(1)
    ]);
    return profiles.length > 0 ? profiles[0] : null;
  }

  static async updateUserProfile(id: string, data: Partial<UserProfile>): Promise<void> {
    return FirebaseService.update<UserProfile>(this.COLLECTION, id, data);
  }
}

export class ProjectService {
  private static readonly COLLECTION = 'projects';

  static async createProject(data: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const projectData = {
      ...data,
      lastModified: Timestamp.now()
    };
    return FirebaseService.create<ProjectData>(this.COLLECTION, projectData);
  }

  static async getProject(id: string): Promise<ProjectData | null> {
    return FirebaseService.getById<ProjectData>(this.COLLECTION, id);
  }

  static async getProjectsByUser(userId: string): Promise<ProjectData[]> {
    return FirebaseService.getMany<ProjectData>(this.COLLECTION, [
      where('userId', '==', userId),
      orderBy('lastModified', 'desc')
    ]);
  }

  static async updateProject(id: string, data: Partial<ProjectData>): Promise<void> {
    const updateData = {
      ...data,
      lastModified: Timestamp.now()
    };
    return FirebaseService.update<ProjectData>(this.COLLECTION, id, updateData);
  }

  static async deleteProject(id: string): Promise<void> {
    return FirebaseService.delete(this.COLLECTION, id);
  }

  static async getProjectStats(userId: string): Promise<{
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    draftProjects: number;
  }> {
    const projects = await this.getProjectsByUser(userId);
    return {
      totalProjects: projects.length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      inProgressProjects: projects.filter(p => p.status === 'in-progress').length,
      draftProjects: projects.filter(p => p.status === 'draft').length
    };
  }
}