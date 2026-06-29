export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Member';
  createdAt: string;
}

export interface Task {
  taskId: number;
  projectId: number;
  title: string;
  description?: string;
  status: 'Todo' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  assignedTo?: number | null;
  assignedUserName?: string;
  createdAt: string;
}

export interface Project {
  projectId: number;
  name: string;
  description?: string;
  createdByName: string;
  createdAt: string;
  isArchived: boolean;
  totalTasks: number;
  completedTasks: number;
}