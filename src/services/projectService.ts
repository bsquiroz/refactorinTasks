import { supabase } from './supabase';
import type { Project, Task } from '../types/project';

// Funciones para proyectos
export const projectService = {
  // Obtener todos los proyectos del usuario
  async getUserProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      return [];
    }
  },

  // Obtener un proyecto específico
  async getProject(id: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error al obtener el proyecto ${id}:`, error);
      return null;
    }
  },

  // Crear un nuevo proyecto
  async createProject(
    project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      return null;
    }
  },

  // Actualizar un proyecto
  async updateProject(
    id: string,
    project: Partial<Project>
  ): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error al actualizar el proyecto ${id}:`, error);
      return null;
    }
  },

  // Eliminar un proyecto
  async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error al eliminar el proyecto ${id}:`, error);
      return false;
    }
  }
};

// Funciones para tareas
export const taskService = {
  // Obtener todas las tareas de un proyecto
  async getProjectTasks(projectId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(
        `Error al obtener tareas del proyecto ${projectId}:`,
        error
      );
      return [];
    }
  },

  // Obtener una tarea específica
  async getTask(id: string): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error al obtener la tarea ${id}:`, error);
      return null;
    }
  },

  // Crear una nueva tarea
  async createTask(
    task: Omit<Task, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al crear tarea:', error);
      return null;
    }
  },

  // Actualizar una tarea
  async updateTask(id: string, task: Partial<Task>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error al actualizar la tarea ${id}:`, error);
      return null;
    }
  },

  // Eliminar una tarea
  async deleteTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error al eliminar la tarea ${id}:`, error);
      return false;
    }
  },

  // Cambiar el estado de una tarea (completada/no completada)
  async toggleTaskCompletion(
    id: string,
    isCompleted: boolean
  ): Promise<Task | null> {
    return this.updateTask(id, { is_completed: isCompleted });
  }
};
