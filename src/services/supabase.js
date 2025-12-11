import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

// ⚠️ IMPORTANT: Reads keys from the Vercel/local .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ----------------------------------------------------
// AI FUNCTIONALITY: GEMINI SEARCH TOOL
// ----------------------------------------------------

// Initialize Gemini Client (reads key from GEMINI_API_KEY environment variable)
// NOTE: On Vercel, the GEMINI_API_KEY must be set directly in Environment Variables.
const ai = new GoogleGenAI({});

// Function to perform a general AI search query
export async function performAiSearch(query) {
  if (!query) return "Please enter a query to search.";
  
  const prompt = `Perform a general search or answer this query concisely and professionally for a project manager: "${query}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    // Return the generated text, cleaning up any potential markdown headers
    return response.text.trim();
    
  } catch (error) {
    console.error("Gemini Search API Error:", error);
    return "Error: Could not connect to Gemini AI for search. Check API key.";
  }
}

// ----------------------------------------------------
// CRUD OPERATIONS (Updated for due_date)
// ----------------------------------------------------

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    // Order by 'To-Do' first, then sort by due date (ascending)
    .order('status')
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  return data;
}

// addTask now accepts a due date
export async function addTask(title, description, dueDate) {
  if (!title) throw new Error("Task title is required.");
  
  const insertData = { 
    title, 
    description, 
    status: 'To-Do', 
    due_date: dueDate || null // Include the new date field
  };
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([insertData])
    .select();
    
  if (error) throw error;
  return data[0];
}

export async function updateTaskStatus(id, newStatus) {
  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteTask(id) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  if (error) throw error;
}