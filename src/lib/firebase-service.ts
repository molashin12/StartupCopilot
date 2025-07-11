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
import { db } from './firebase';

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

// Generic CRUD operations
export class FirebaseService {
  // Create a new document
  static async create<T extends BaseDocument>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    const now = Timestamp.now();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, collectionName), docData);
    return docRef.id;
  }

  // Read a single document
  static async getById<T extends BaseDocument>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  // Read multiple documents with optional filters
  static async getMany<T extends BaseDocument>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  // Update a document
  static async update<T extends BaseDocument>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    const updateData = {
      ...data,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(docRef, updateData);
  }

  // Delete a document
  static async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
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

  static async getConsultants(): Promise<UserProfile[]> {
    return FirebaseService.getMany<UserProfile>(this.COLLECTION, [
      where('role', '==', 'consultant')
    ]);
  }
}