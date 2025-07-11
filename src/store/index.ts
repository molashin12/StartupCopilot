import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Project, LoadingState, ErrorState } from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Project Store
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,
      setProjects: (projects) => set({ projects, error: null }),
      setCurrentProject: (currentProject) => set({ currentProject }),
      addProject: (project) => {
        const { projects } = get();
        set({ projects: [project, ...projects], error: null });
      },
      updateProject: (id, updates) => {
        const { projects, currentProject } = get();
        const updatedProjects = projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );
        const updatedCurrentProject =
          currentProject?.id === id ? { ...currentProject, ...updates } : currentProject;
        set({
          projects: updatedProjects,
          currentProject: updatedCurrentProject,
          error: null,
        });
      },
      deleteProject: (id) => {
        const { projects, currentProject } = get();
        const filteredProjects = projects.filter((p) => p.id !== id);
        const updatedCurrentProject = currentProject?.id === id ? null : currentProject;
        set({
          projects: filteredProjects,
          currentProject: updatedCurrentProject,
          error: null,
        });
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'project-storage',
      partialize: (state) => ({
        projects: state.projects,
        currentProject: state.currentProject,
      }),
    }
  )
);

// UI Store
interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  loadingStates: Record<string, LoadingState>;
  errorStates: Record<string, ErrorState>;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (open: boolean) => void;
  setLoadingState: (key: string, state: LoadingState) => void;
  setErrorState: (key: string, state: ErrorState) => void;
  clearLoadingState: (key: string) => void;
  clearErrorState: (key: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarOpen: true,
      loadingStates: {},
      errorStates: {},
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setLoadingState: (key, state) => {
        const { loadingStates } = get();
        set({ loadingStates: { ...loadingStates, [key]: state } });
      },
      setErrorState: (key, state) => {
        const { errorStates } = get();
        set({ errorStates: { ...errorStates, [key]: state } });
      },
      clearLoadingState: (key) => {
        const { loadingStates } = get();
        const newStates = { ...loadingStates };
        delete newStates[key];
        set({ loadingStates: newStates });
      },
      clearErrorState: (key) => {
        const { errorStates } = get();
        const newStates = { ...errorStates };
        delete newStates[key];
        set({ errorStates: newStates });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// AI Store
interface AIState {
  chatHistory: Array<{
    id: string;
    message: string;
    response: string;
    timestamp: Date;
  }>;
  isProcessing: boolean;
  lastAnalysis: any;
  usageStats: {
    queriesUsed: number;
    tokensUsed: number;
    lastReset: Date;
  };
  addChatMessage: (message: string, response: string) => void;
  setProcessing: (processing: boolean) => void;
  setLastAnalysis: (analysis: any) => void;
  updateUsageStats: (tokens: number) => void;
  clearChatHistory: () => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      chatHistory: [],
      isProcessing: false,
      lastAnalysis: null,
      usageStats: {
        queriesUsed: 0,
        tokensUsed: 0,
        lastReset: new Date(),
      },
      addChatMessage: (message, response) => {
        const { chatHistory } = get();
        const newMessage = {
          id: Date.now().toString(),
          message,
          response,
          timestamp: new Date(),
        };
        set({ chatHistory: [...chatHistory, newMessage] });
      },
      setProcessing: (isProcessing) => set({ isProcessing }),
      setLastAnalysis: (lastAnalysis) => set({ lastAnalysis }),
      updateUsageStats: (tokens) => {
        const { usageStats } = get();
        set({
          usageStats: {
            ...usageStats,
            queriesUsed: usageStats.queriesUsed + 1,
            tokensUsed: usageStats.tokensUsed + tokens,
          },
        });
      },
      clearChatHistory: () => set({ chatHistory: [] }),
    }),
    {
      name: 'ai-storage',
      partialize: (state) => ({
        chatHistory: state.chatHistory,
        usageStats: state.usageStats,
      }),
    }
  )
);

// Analytics Store
interface AnalyticsState {
  events: Array<{
    id: string;
    event: string;
    properties: Record<string, any>;
    timestamp: Date;
  }>;
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  getEvents: (eventName?: string) => any[];
  clearEvents: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      events: [],
      trackEvent: (event, properties = {}) => {
        const { events } = get();
        const newEvent = {
          id: Date.now().toString(),
          event,
          properties,
          timestamp: new Date(),
        };
        set({ events: [...events, newEvent] });
      },
      getEvents: (eventName) => {
        const { events } = get();
        return eventName ? events.filter((e) => e.event === eventName) : events;
      },
      clearEvents: () => set({ events: [] }),
    }),
    {
      name: 'analytics-storage',
      partialize: (state) => ({ events: state.events }),
    }
  )
);

// Store selectors for better performance
export const selectUser = (state: AuthState) => state.user;
export const selectProjects = (state: ProjectState) => state.projects;
export const selectCurrentProject = (state: ProjectState) => state.currentProject;
export const selectTheme = (state: UIState) => state.theme;
export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
export const selectChatHistory = (state: AIState) => state.chatHistory;
export const selectUsageStats = (state: AIState) => state.usageStats;
export const selectAnalyticsEvents = (state: AnalyticsState) => state.events;