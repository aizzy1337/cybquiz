const STORAGE_KEY = 'cybquiz_mock_db_v2';

const defaultDb = {
  users: [
    {
      userId: 'u-1',
      login: 'demo',
      password: 'demo123',
      role: 'admin'
    }
  ],
  groups: [
    {
      groupId: 'g-1',
      name: 'General',
      userIds: ['u-1'],
      quizIds: ['quiz-1'],
      admin: 'u-1',
      joinCode: 'GENERAL1'
    }
  ],
  quizzes: [
    {
      quizId: 'quiz-1',
      name: 'Phishing Basics',
      questionIds: ['q-1', 'q-2', 'q-3'],
      createdBy: 'u-1'
    }
  ],
  questions: [
    {
      questionId: 'q-1',
      name: 'Suspicious email marker',
      type: 'quiz',
      createdBy: 'u-1',
      content: {
        question: 'What is a common phishing signal?',
        options: [
          'Verified sender with expected context',
          'Urgent request for personal data',
          'Internal memo from your manager',
          'Scheduled system maintenance reminder'
        ],
        correctAnswer: 1,
        explanation: 'Phishing messages often pressure users with urgency and request sensitive data.'
      }
    },
    {
      questionId: 'q-2',
      name: 'Safe response',
      type: 'quiz',
      createdBy: 'u-1',
      content: {
        question: 'What should you do first after suspicious bank email?',
        options: [
          'Click the provided verification link',
          'Reply and ask if this is real',
          'Call the bank via official contact channel',
          'Forward it to friends'
        ],
        correctAnswer: 2,
        explanation: 'Always verify using trusted channels, never links from suspicious messages.'
      }
    },
    {
      questionId: 'q-3',
      name: 'HTTPS meaning',
      type: 'quiz',
      createdBy: 'u-1',
      content: {
        question: 'What does HTTPS guarantee?',
        options: [
          'The website is always legitimate',
          'The connection is encrypted',
          'The domain is government-approved',
          'The site has no malware'
        ],
        correctAnswer: 1,
        explanation: 'HTTPS encrypts transport, but phishing sites can also use it.'
      }
    }
  ],
  scores: []
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function loadDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
    return clone(defaultDb);
  }

  try {
    const parsed = JSON.parse(raw);
    const users = (parsed.users || []).map((user) => ({
      ...user,
      role: user.role || (user.userId === 'u-1' ? 'admin' : 'user')
    }));
    const quizzes = (parsed.quizzes || []).map((q) => ({
      ...q,
      createdBy: q.createdBy || 'u-1'
    }));
    const questions = (parsed.questions || []).map((q) => ({
      ...q,
      createdBy: q.createdBy || 'u-1'
    }));

    return {
      users,
      groups: parsed.groups || [],
      quizzes,
      questions,
      scores: parsed.scores || []
    };
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
    return clone(defaultDb);
  }
}

export function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function updateDb(updater) {
  const current = loadDb();
  const updated = updater(clone(current));
  saveDb(updated);
  return updated;
}

export function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}
