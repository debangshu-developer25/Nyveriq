export interface Task {
  id: number;
  title: string;
  priority: "Low" | "Medium" | "High";
  assignee: string;
  status: string;
}

export interface ApiTask {
  taskId: number;
  title: string;
  priority: string;
  status: string;
  assignedUserName: string | null;
}