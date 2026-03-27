import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vhozaeaybvxwrmfgkpoz.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZob3phZWF5YnZ4d3JtZmdrcG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTEwNzIsImV4cCI6MjA5MDE4NzA3Mn0.AZsxC7Hr1Ov4lAFvEP4djWLwYcXMTQD33Ezir6fqhDA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  if (error) console.error('Error fetching events:', error);
  return data || [];
}

export async function getNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  if (error) console.error('Error fetching news:', error);
  return data || [];
}

export async function getTeam() {
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) console.error('Error fetching team:', error);
  return data || [];
}

export async function getAboutSection(sectionName) {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .eq('section_name', sectionName)
    .maybeSingle();
  if (error) console.error('Error fetching about:', error);
  return data?.content || '';
}

export async function getSetting(key) {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .maybeSingle();
  if (error) console.error('Error fetching setting:', error);
  return data?.value || '';
}

export async function createEvent(event) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select();
  if (error) console.error('Error creating event:', error);
  return data?.[0] || null;
}

export async function updateEvent(id, event) {
  const { data, error } = await supabase
    .from('events')
    .update({ ...event, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) console.error('Error updating event:', error);
  return data?.[0] || null;
}

export async function deleteEvent(id) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting event:', error);
  return !error;
}

export async function createNews(news) {
  const { data, error } = await supabase
    .from('news')
    .insert([news])
    .select();
  if (error) console.error('Error creating news:', error);
  return data?.[0] || null;
}

export async function updateNews(id, news) {
  const { data, error } = await supabase
    .from('news')
    .update({ ...news, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) console.error('Error updating news:', error);
  return data?.[0] || null;
}

export async function deleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting news:', error);
  return !error;
}

export async function createTeamMember(member) {
  const { data, error } = await supabase
    .from('team')
    .insert([member])
    .select();
  if (error) console.error('Error creating team member:', error);
  return data?.[0] || null;
}

export async function updateTeamMember(id, member) {
  const { data, error } = await supabase
    .from('team')
    .update({ ...member, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  if (error) console.error('Error updating team member:', error);
  return data?.[0] || null;
}

export async function deleteTeamMember(id) {
  const { error } = await supabase
    .from('team')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting team member:', error);
  return !error;
}

export async function updateAboutSection(sectionName, content) {
  const existing = await getAboutSection(sectionName);
  if (existing) {
    const { data, error } = await supabase
      .from('about')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('section_name', sectionName)
      .select();
    if (error) console.error('Error updating about:', error);
    return data?.[0] || null;
  } else {
    const { data, error } = await supabase
      .from('about')
      .insert([{ section_name: sectionName, content }])
      .select();
    if (error) console.error('Error creating about:', error);
    return data?.[0] || null;
  }
}

export async function updateSetting(key, value) {
  const { data: existing } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)
      .select();
    if (error) console.error('Error updating setting:', error);
    return data?.[0] || null;
  } else {
    const { data, error } = await supabase
      .from('settings')
      .insert([{ key, value }])
      .select();
    if (error) console.error('Error creating setting:', error);
    return data?.[0] || null;
  }
}
