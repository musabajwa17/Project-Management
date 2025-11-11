export type TaskStatus = 'todo' | 'in-progress' | 'done';


export interface Task {
id: string;
project_id: string;
name: string;
status: TaskStatus;
}


export interface Project {
id: string;
user_id?: string;
title: string;
client_name?: string;
deadline?: string; // ISO date
tasks?: Task[];
}