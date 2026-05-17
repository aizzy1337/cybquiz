import { createQuestion, getAllQuestions } from './questionsApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const CURRENT_USER_KEY = 'cybquiz_current_user';

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

async function request(path, { method = 'POST', body } = {}) {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`${path} failed with status ${response.status}`);
  }

  return parseResponse(response);
}

function normalizeQuestion(dto, index) {
  const questionId = dto.id || dto.questionId || `api-q-${index + 1}`;

  let content = dto.content;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch {
      content = {};
    }
  }

  return {
    questionId,
    name: dto.name || content.question || `Question ${index + 1}`,
    type: dto.type || 'quiz',
    createdBy: dto.createdBy || null,
    content: {
      ...content,
      question: content.question || dto.name || 'Untitled question',
      options: Array.isArray(content.options) ? content.options : [],
      correctAnswer: Number.isInteger(content.correctAnswer) ? content.correctAnswer : 0,
      explanation: content.explanation || ''
    }
  };
}

function normalizeQuiz(dto) {
  return {
    quizId: dto.id,
    name: dto.title,
    questionIds: Array.isArray(dto.questionIds) ? dto.questionIds : [],
    createdBy: dto.createdBy || null
  };
}

function normalizeGroup(dto) {
  return {
    groupId: dto.id,
    name: dto.name,
    userIds: Array.isArray(dto.userIds) ? dto.userIds : [],
    quizIds: Array.isArray(dto.quizIds) ? dto.quizIds : [],
    admin: dto.adminId,
    joinCode: dto.joinCode || ''
  };
}

function normalizeScore(dto) {
  return {
    scoreId: dto.id,
    groupId: dto.groupId || null,
    userId: dto.userId,
    scores: {
      quizId: dto.quizId,
      correct: dto.correct,
      total: dto.total,
      createdAt: dto.createdAt || new Date().toISOString()
    }
  };
}

export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export async function register(login, password) {
  if (!login || !password) {
    throw new Error('Login and password are required');
  }

  await request('auth/register', {
    body: {
      login,
      password,
      role: 'user'
    }
  });

  return loginUser(login, password);
}

export async function login(loginValue, passwordValue) {
  return loginUser(loginValue, passwordValue);
}

async function loginUser(loginValue, passwordValue) {
  const result = await request('auth/login', {
    body: {
      login: loginValue,
      password: passwordValue
    }
  });

  const authenticated = {
    userId: result.userId,
    login: result.login,
    role: result.role || 'user'
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authenticated));
  return authenticated;
}

export async function getQuizzes() {
  const data = await request('getAllQuizzes', { method: 'GET' });
  return Array.isArray(data) ? data.map(normalizeQuiz) : [];
}

export async function getAdminQuizzes(adminUserId) {
  const data = await request('getQuizzesByCreator', {
    body: adminUserId
  });
  return Array.isArray(data) ? data.map(normalizeQuiz) : [];
}

export async function getQuizzesForGroup(groupId) {
  const [groups, quizzes] = await Promise.all([getGroups(), getQuizzes()]);
  const group = groups.find((g) => g.groupId === groupId);
  if (!group) return [];

  const ids = new Set(group.quizIds || []);
  return quizzes.filter((q) => ids.has(q.quizId));
}

export async function createQuiz({ name, questionIds, createdBy }) {
  if (!name || !Array.isArray(questionIds) || questionIds.length === 0) {
    throw new Error('Quiz name and at least one question are required');
  }

  const result = await request('createQuiz', {
    body: {
      title: name,
      createdBy: createdBy || null,
      questionIds: Array.from(new Set(questionIds))
    }
  });

  return normalizeQuiz(result);
}

export async function updateQuiz({ quizId, name, questionIds, createdBy }) {
  if (!quizId || !name || !Array.isArray(questionIds) || questionIds.length === 0) {
    throw new Error('Quiz id, name and at least one question are required');
  }

  const result = await request('updateQuiz', {
    body: {
      id: quizId,
      dto: {
        id: quizId,
        title: name,
        createdBy: createdBy || null,
        questionIds: Array.from(new Set(questionIds))
      }
    }
  });

  return normalizeQuiz(result);
}

export async function getQuestions() {
  const apiQuestions = await getAllQuestions();
  return apiQuestions.map(normalizeQuestion).filter((q) => q.content.options.length > 1);
}

export async function getAdminQuestions(adminUserId) {
  const questions = await getQuestions();
  return questions.filter((q) => q.createdBy === adminUserId || q.createdBy === null);
}

export async function addQuestion(input) {
  const questionPayload = {
    name: input.name,
    type: input.type || 'quiz',
    createdBy: input.createdBy || null,
    content: JSON.stringify(input.content)
  };

  const created = await createQuestion(questionPayload);
  return {
    questionId: created.id,
    name: input.name,
    type: input.type || 'quiz',
    createdBy: input.createdBy || null,
    content: input.content
  };
}

export async function updateQuestion({ questionId, name, type, content, createdBy }) {
  if (!questionId || !name || !type || !content) {
    throw new Error('Question id, name, type and content are required');
  }

  const result = await request('updateQuestion', {
    body: {
      id: questionId,
      name,
      type,
      createdBy: createdBy || null,
      content: JSON.stringify(content)
    }
  });

  return normalizeQuestion(result, 0);
}

export async function deleteQuestion(questionId) {
  await request('deleteQuestion', { body: questionId });
}

export async function deleteQuiz(quizId) {
  await request('deleteQuiz', { body: quizId });
}

export async function getGroups() {
  const data = await request('getAllGroups', { method: 'GET' });
  return Array.isArray(data) ? data.map(normalizeGroup) : [];
}

export async function createGroup(name, adminUserId) {
  if (!name || !adminUserId) {
    throw new Error('Group name and admin are required');
  }

  const result = await request('createGroup', {
    body: {
      name,
      adminId: adminUserId,
      quizIds: [],
      userIds: [adminUserId]
    }
  });

  return {
    groupId: result.id,
    name,
    userIds: [adminUserId],
    quizIds: [],
    admin: adminUserId,
    joinCode: result.joinCode
  };
}

export async function assignQuizToGroup(groupId, quizId) {
  await request('addQuizToGroup', {
    body: { groupId, quizId }
  });
}

export async function removeQuizFromGroup(groupId, quizId) {
  await request('removeQuizFromGroup', {
    body: { groupId, quizId }
  });
}

export async function joinGroup(joinCode, userId) {
  if (!joinCode || !userId) {
    throw new Error('Join code and user are required');
  }

  await request('joinGroup', {
    body: {
      joinCode: joinCode.toUpperCase(),
      userId
    }
  });

  const userGroups = await getUserGroups(userId);
  const joinedGroup = userGroups.find((item) => item.joinCode?.toUpperCase() === joinCode.toUpperCase());

  if (!joinedGroup) {
    throw new Error('Join succeeded but group could not be loaded');
  }

  return joinedGroup;
}

export async function submitScore({ groupId, userId, quizId, correct, total }) {
  if (!userId || !quizId || !Number.isInteger(correct) || !Number.isInteger(total)) {
    throw new Error('Invalid score payload');
  }

  const result = await request('createScore', {
    body: {
      groupId: groupId || null,
      userId,
      quizId,
      correct,
      total,
      createdAt: new Date().toISOString()
    }
  });

  return normalizeScore(result);
}

async function getAllScores() {
  const data = await request('getAllScores', { method: 'GET' });
  return Array.isArray(data) ? data.map(normalizeScore) : [];
}

async function getUsersMap() {
  const users = await request('getAllUsers', { method: 'GET' });
  const map = new Map();
  (users || []).forEach((u) => {
    map.set(u.userId, u.login);
  });
  return map;
}

export async function getLeaderboard() {
  const [scores, usersMap] = await Promise.all([getAllScores(), getUsersMap()]);
  return buildLeaderboard(scores, usersMap, null);
}

export async function getLeaderboardForGroup(groupId) {
  const [scores, usersMap] = await Promise.all([getAllScores(), getUsersMap()]);
  return buildLeaderboard(scores, usersMap, groupId);
}

function buildLeaderboard(scores, usersMap, groupId) {
  const byUser = new Map();

  scores.forEach((entry) => {
    if (groupId && entry.groupId !== groupId) return;
    const previous = byUser.get(entry.userId) || { correct: 0, total: 0, attempts: 0 };
    previous.correct += entry.scores.correct;
    previous.total += entry.scores.total;
    previous.attempts += 1;
    byUser.set(entry.userId, previous);
  });

  return Array.from(byUser.entries())
    .map(([userId, agg]) => ({
      userId,
      login: usersMap.get(userId) || 'unknown',
      attempts: agg.attempts,
      correct: agg.correct,
      total: agg.total,
      accuracy: agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0
    }))
    .sort((a, b) => b.accuracy - a.accuracy || b.correct - a.correct);
}

export async function getUserGroups(userId) {
  const groups = await request('getUserGroups', { body: userId });
  return Array.isArray(groups) ? groups.map(normalizeGroup) : [];
}

export async function getUserScores(userId) {
  const [scoresRaw, quizzes, groups] = await Promise.all([
    request('getMyScores', { body: userId }),
    getQuizzes(),
    getGroups()
  ]);

  const scores = Array.isArray(scoresRaw) ? scoresRaw.map(normalizeScore) : [];

  return scores
    .map((entry) => {
      const quiz = quizzes.find((q) => q.quizId === entry.scores.quizId);
      const group = groups.find((g) => g.groupId === entry.groupId);
      return {
        scoreId: entry.scoreId,
        quizName: quiz ? quiz.name : entry.scores.quizId,
        groupName: group ? group.name : '—',
        correct: entry.scores.correct,
        total: entry.scores.total,
        accuracy: entry.scores.total > 0
          ? Math.round((entry.scores.correct / entry.scores.total) * 100)
          : 0,
        createdAt: entry.scores.createdAt
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
