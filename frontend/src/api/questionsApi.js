const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('API response is not valid JSON');
  }
}

async function requestQuestions(method) {
  const response = await fetch(`${API_BASE_URL}/getAllQuestions`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: method === 'POST' ? '{}' : undefined
  });

  if (!response.ok) {
    throw new Error(`Question API request failed with status ${response.status}`);
  }

  const data = await parseResponse(response);
  if (!Array.isArray(data)) {
    throw new Error('Question API response is not an array');
  }

  return data;
}

export async function getAllQuestions() {
  try {
    return await requestQuestions('GET');
  } catch {
    return requestQuestions('POST');
  }
}

export async function getQuestionById(id) {
  const response = await fetch(`${API_BASE_URL}/getQuestionById`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(id)
  });

  if (!response.ok) {
    throw new Error(`Get question by id failed with status ${response.status}`);
  }

  return parseResponse(response);
}

export async function createQuestion(payload) {
  const response = await fetch(`${API_BASE_URL}/createQuestion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Create question failed with status ${response.status}`);
  }

  const data = await parseResponse(response);
  if (!data || typeof data.id !== 'string') {
    throw new Error('Create question response does not contain id');
  }

  return data;
}
