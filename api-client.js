const API_BASE = '/api/content';

async function apiCall(type, method = 'GET', data = null, id = null) {
  const url = new URL(API_BASE, window.location.origin);
  url.searchParams.append('type', type);
  if (id) url.searchParams.append('id', id);

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(url.toString(), options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// EVENTS
export async function getEvents() {
  try {
    const data = await apiCall('events');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

export async function createEvent(eventData) {
  return apiCall('events', 'POST', eventData);
}

export async function deleteEvent(id) {
  return apiCall('events', 'DELETE', null, id);
}

export async function updateEvent() {
  // Placeholder for compatibility
}

// NEWS
export async function getNews() {
  try {
    const data = await apiCall('news');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching news:', err);
    return [];
  }
}

export async function createNews(newsData) {
  newsData.created_at = newsData.created_at || new Date().toISOString();
  return apiCall('news', 'POST', newsData);
}

export async function deleteNews(id) {
  return apiCall('news', 'DELETE', null, id);
}

export async function updateNews() {
  // Placeholder for compatibility
}

// TEAM
export async function getTeam() {
  try {
    const data = await apiCall('team');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching team:', err);
    return [];
  }
}

export async function createTeamMember(memberData) {
  return apiCall('team', 'POST', memberData);
}

export async function deleteTeamMember(id) {
  return apiCall('team', 'DELETE', null, id);
}

export async function updateTeamMember() {
  // Placeholder for compatibility
}

// ABOUT
export async function getAboutSection(sectionName) {
  try {
    const data = await apiCall('about');
    return (data && data[sectionName]) || '';
  } catch (err) {
    console.error('Error fetching about:', err);
    return '';
  }
}

export async function updateAboutSection(sectionName, content) {
  try {
    const data = await apiCall('about');
    const aboutData = { id: sectionName, ...data, [sectionName]: content };
    return apiCall('about', 'POST', aboutData);
  } catch (err) {
    console.error('Error updating about:', err);
  }
}
