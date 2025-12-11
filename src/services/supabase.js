// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// ⚠️ PASTE YOUR COPIED CREDENTIALS HERE ⚠️
const supabaseUrl = 'https://kyrpwtlwnkdnhubxwxbe.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5cnB3dGx3bmtkbmh1Ynh3eGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0Mjg1ODAsImV4cCI6MjA4MTAwNDU4MH0.yTwNwErDaNkJTe5LNKG4Fo9SJLPmqpH_pZ823dGar9M'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- READ: Fetch all tasks ---
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false }); 

  if (error) {
    console.error('Error fetching tasks:', error);
    return []; 
  }
  return data;
}

// --- CREATE: Add a new task ---
export async function addTask(title, description) {
  if (!title) throw new Error("Task title is required."); 
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, description, status: 'To-Do' }])
    .select(); 
  if (error) throw error;
  return data[0];
}

// --- UPDATE: Change task status ---
export async function updateTaskStatus(id, newStatus) {
  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', id); 
  if (error) throw error;
}

// --- DELETE: Remove a task ---
export async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id); 
  if (error) throw error;
}