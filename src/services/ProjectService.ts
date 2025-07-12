import { ProjectService as FirebaseProjectService } from '@/lib/firebase-service';

// Re-export the ProjectService from firebase-service for cleaner imports
export const ProjectService = FirebaseProjectService;

// Export the class as default as well
export default FirebaseProjectService;