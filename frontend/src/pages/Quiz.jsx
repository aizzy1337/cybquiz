import { useEffect, useMemo, useState } from 'react';
import { getQuestions, getQuizzesForGroup, getUserGroups, submitScore } from '../api/cybquizApi';

const questionTypeUi = {
  quiz: { label: 'Quiz', icon: 'Q', className: 'question-type-quiz' },
  email: { label: 'Email', icon: 'E', className: 'question-type-email' },
  sms: { label: 'SMS', icon: 'S', className: 'question-type-sms' },
  website: { label: 'Website', icon: 'W', className: 'question-type-website' },
  social: { label: 'Social', icon: 'M', className: 'question-type-social' }
};

function QuestionScenario({ question }) {
  const content = question.content || {};
  const prompt = content.question || question.name || 'Przeanalizuj komunikat.';

  if (question.type === 'email') {
    const from = content.from || 'security@company-support.com';
    const to = content.to || 'you@company.com';
    const subject = content.subject || question.name || 'Pilna akcja wymagana';
    const suspiciousLink = content.url || content.link || 'secure-verify-account.example.net';
    const cta = content.cta || 'Zweryfikuj konto';

    return (
      <div className="scenario-email">
        <div className="scenario-mail-topbar">
          <span className="scenario-mail-dot" />
          <span className="scenario-mail-dot" />
          <span className="scenario-mail-dot" />
        </div>
        <div className="scenario-mail-body">
          <p className="scenario-title">Podglad skrzynki e-mail</p>
          <div className="scenario-email-head">
            <p><strong>From:</strong> {from}</p>
            <p><strong>To:</strong> {to}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Time:</strong> 09:13</p>
          </div>
          <p className="question-text">{prompt}</p>
          <div className="scenario-email-link">{suspiciousLink}</div>
          <div className="scenario-email-cta">{cta}</div>
        </div>
      </div>
    );
  }

  if (question.type === 'sms') {
    const sender = content.sender || 'Bank Alert';
    const phone = content.phone || '+48 600 100 200';

    return (
      <div className="scenario-sms">
        <div className="scenario-sms-screen">
          <p className="scenario-title">Wiadomosc SMS</p>
          <p className="scenario-sms-sender">{sender}</p>
          <p className="scenario-sms-phone">{phone}</p>
          <div className="scenario-sms-bubble">{prompt}</div>
          <div className="scenario-sms-meta">Dzisiaj, 14:08</div>
        </div>
      </div>
    );
  }

  if (question.type === 'website') {
    const url = content.url || 'secure-login.example.com';

    return (
      <div className="scenario-website">
        <div className="scenario-website-browser">
          <span className="scenario-mail-dot" />
          <span className="scenario-mail-dot" />
          <span className="scenario-mail-dot" />
          <div className="scenario-website-bar">
            <span>https://</span>
            <span>{url}</span>
          </div>
        </div>
        <div className="scenario-website-content">
          <p className="scenario-title">Widok strony logowania</p>
          <p className="question-text">{prompt}</p>
          <div className="scenario-website-login">
            <div className="scenario-website-field">Email / Login</div>
            <div className="scenario-website-field">Haslo</div>
            <div className="scenario-website-button">Zaloguj sie</div>
          </div>
        </div>
      </div>
    );
  }

  if (question.type === 'social') {
    const author = content.author || 'Support Team';
    const platform = content.platform || 'Social platform';
    const avatar = author.slice(0, 2).toUpperCase();

    return (
      <div className="scenario-social">
        <p className="scenario-title">Post w mediach spolecznosciowych</p>
        <div className="scenario-social-head">
          <div className="scenario-social-meta">
            <div className="scenario-social-avatar">{avatar}</div>
            <strong>{author}</strong>
          </div>
          <span>{platform}</span>
        </div>
        <p className="question-text">{prompt}</p>
        <div className="scenario-social-cta">Sprawdz szczegoly</div>
      </div>
    );
  }

  return (
    <div>
      <p className="scenario-title">Pytanie quizowe</p>
      <p className="question-text">{prompt}</p>
    </div>
  );
}

function Quiz({ currentUser }) {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadGroups = async () => {
      try {
        const loadedGroups = await getUserGroups(currentUser.userId);
        if (isMounted) {
          setUserGroups(loadedGroups);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      }
    };

    loadGroups();
    return () => {
      isMounted = false;
    };
  }, [currentUser.userId]);

  useEffect(() => {
    let isMounted = true;

    const loadQuizzes = async () => {
      if (!selectedGroupId) {
        setQuizzes([]);
        setSelectedQuizId('');
        return;
      }

      try {
        const loadedQuizzes = await getQuizzesForGroup(selectedGroupId);
        if (!isMounted) return;
        setQuizzes(loadedQuizzes);
        setSelectedQuizId((prev) => {
          if (prev && loadedQuizzes.some((q) => q.quizId === prev)) {
            return prev;
          }
          return loadedQuizzes[0]?.quizId || '';
        });
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      }
    };

    loadQuizzes();
    return () => {
      isMounted = false;
    };
  }, [selectedGroupId]);

  const selectedQuiz = quizzes.find((q) => q.quizId === selectedQuizId);

  const activeQuestions = useMemo(() => {
    if (!selectedQuiz || !Array.isArray(selectedQuiz.questionIds) || selectedQuiz.questionIds.length === 0) {
      return questions;
    }
    const ids = new Set(selectedQuiz.questionIds);
    const filtered = questions.filter((q) => ids.has(q.questionId));
    return filtered.length > 0 ? filtered : questions;
  }, [questions, selectedQuiz]);

  const currentQuestion = activeQuestions[questionIndex];
  const typeUi = questionTypeUi[currentQuestion?.type] || questionTypeUi.quiz;

  const restart = () => {
    setQuestionIndex(0);
    setAnswers({});
    setFinished(false);
    setStatus('');
    setError('');
  };

  const resetSelectionFlow = () => {
    setStarted(false);
    setIsLoading(false);
    restart();
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId);
    resetSelectionFlow();
  };

  const handleQuizChange = (quizId) => {
    setSelectedQuizId(quizId);
    resetSelectionFlow();
  };

  const startQuiz = async () => {
    if (!selectedGroupId || !selectedQuizId) {
      setError('Najpierw wybierz grupe i quiz.');
      return;
    }

    setError('');
    setStatus('');
    setIsLoading(true);
    try {
      const loaded = await getQuestions();
      setQuestions(loaded);
      setStarted(true);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (optionIndex) => {
    if (finished) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const nextQuestion = () => {
    if (answers[questionIndex] === undefined) {
      setError('Wybierz odpowiedz, aby przejsc dalej.');
      return;
    }

    setError('');
    if (questionIndex < activeQuestions.length - 1) {
      setQuestionIndex((v) => v + 1);
    } else {
      setFinished(true);
    }
  };

  const score = activeQuestions.reduce((acc, question, index) => {
    return answers[index] === question.content.correctAnswer ? acc + 1 : acc;
  }, 0);

  const saveScore = async () => {
    try {
      await submitScore({
        groupId: selectedGroupId,
        userId: currentUser.userId,
        quizId: selectedQuizId,
        correct: score,
        total: activeQuestions.length
      });
      setStatus('Wynik zapisany!');
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  if (!started) {
    return (
      <div className="stack-lg">
        <section className="card hero-card">
          <h1>Quiz</h1>
          <p className="muted">Wybierz grupe i quiz, aby rozpoczac.</p>
        </section>

        <section className="card">
          <div className="form-grid">
            <label>
              1. Wybierz grupe
              <select value={selectedGroupId} onChange={(e) => handleGroupChange(e.target.value)}>
                <option value="">— wybierz grupe —</option>
                {userGroups.map((g) => (
                  <option key={g.groupId} value={g.groupId}>{g.name}</option>
                ))}
              </select>
            </label>

            {selectedGroupId && quizzes.length === 0 && (
              <p className="muted">Ta grupa nie ma jeszcze przypisanych quizow.</p>
            )}

            {quizzes.length > 0 && (
              <label>
                2. Wybierz quiz
                <select value={selectedQuizId} onChange={(e) => handleQuizChange(e.target.value)}>
                  {quizzes.map((q) => (
                    <option key={q.quizId} value={q.quizId}>{q.name}</option>
                  ))}
                </select>
              </label>
            )}

            {selectedQuizId && (
              <div className="quiz-start-actions">
                <p className="muted quiz-selection-meta">Liczba pytan: {selectedQuiz?.questionIds?.length ?? '?'}</p>
                <button className="btn btn-primary" type="button" onClick={startQuiz} disabled={isLoading}>
                  {isLoading ? 'Ladowanie...' : 'Rozpocznij quiz'}
                </button>
              </div>
            )}
          </div>

          {userGroups.length === 0 && (
            <p className="error-text">Nie nalezysz do zadnej grupy. Dolacz do grupy, aby rozwiazac quiz.</p>
          )}
          {error && <p className="error-text">{error}</p>}
        </section>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="row between wrap">
          <div>
            <h1>{selectedQuiz?.name}</h1>
            <p className="muted">Grupa: {userGroups.find((g) => g.groupId === selectedGroupId)?.name}</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={resetSelectionFlow}>
            ← Zmien quiz
          </button>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      {activeQuestions.length === 0 && !error && (
        <section className="card">
          <p>Ladowanie pytan…</p>
        </section>
      )}

      {activeQuestions.length > 0 && !finished && currentQuestion && (
        <section className="card">
          <div className="row between">
            <h2>Pytanie {questionIndex + 1} / {activeQuestions.length}</h2>
          </div>

          <div className={`question-shell ${typeUi.className}`}>
            <div className="question-type-badge">
              <span className="question-type-icon">{typeUi.icon}</span>
              <strong>{typeUi.label}</strong>
            </div>
            <QuestionScenario question={currentQuestion} />
          </div>

          <div className="stack-sm quiz-answers-list">
            {currentQuestion.content.options.map((option, index) => {
              const selected = answers[questionIndex] === index;
              return (
                <button
                  key={`${currentQuestion.questionId}-${index}`}
                  type="button"
                  className={`answer-btn ${selected ? 'answer-btn-selected' : ''}`}
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="row gap quiz-nav-actions">
            <button className="btn btn-primary" type="button" onClick={nextQuestion}>
              {questionIndex < activeQuestions.length - 1 ? 'Nastepne' : 'Zakoncz quiz'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={restart}>Zacznij od nowa</button>
          </div>
        </section>
      )}

      {finished && (
        <section className="card">
          <h2>Wynik koncowy</h2>
          <p className="metric">{score} / {activeQuestions.length}</p>
          <p className="muted quiz-result-meta">
            Skutecznosc: {activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0}%
          </p>

          <div className="row gap quiz-result-actions">
            <button className="btn btn-primary" type="button" onClick={saveScore}>Zapisz wynik</button>
            <button className="btn btn-secondary" type="button" onClick={restart}>Rozwiaz ponownie</button>
            <button className="btn btn-secondary" type="button" onClick={resetSelectionFlow}>Wybierz inny quiz</button>
          </div>

          {status && <p className="success-text">{status}</p>}
          {error && <p className="error-text">{error}</p>}
        </section>
      )}
    </div>
  );
}

export default Quiz;
