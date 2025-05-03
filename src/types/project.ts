export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
  project_id: string;
  user_id: string;
}
