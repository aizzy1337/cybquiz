import { Fragment, useEffect, useState } from 'react';
import {
  addQuestion,
  createQuiz,
  deleteQuestion,
  deleteQuiz,
  getAdminQuestions,
  getAdminQuizzes,
  updateQuestion,
  updateQuiz
} from '../api/cybquizApi';

const emptyForm = {
  name: '',
  type: 'quiz',
  question: '',
  options: '',
  correctAnswer: 0,
  explanation: '',
  metadata: {
    from: '',
    subject: '',
    sender: '',
    phone: '',
    url: '',
    author: '',
    platform: ''
  }
};

const typeOptions = ['quiz', 'email', 'sms', 'website', 'social'];

const typeSpecificFields = {
  quiz: [],
  email: [
    { key: 'from', label: 'From', placeholder: 'security@bank.com' },
    { key: 'subject', label: 'Subject', placeholder: 'Pilna weryfikacja konta' }
  ],
  sms: [
    { key: 'sender', label: 'Nadawca', placeholder: 'Bank Alert' },
    { key: 'phone', label: 'Numer telefonu', placeholder: '+48 600 100 200' }
  ],
  website: [
    { key: 'url', label: 'URL strony', placeholder: 'secure-login.example.com' }
  ],
  social: [
    { key: 'author', label: 'Autor profilu', placeholder: 'HelpDesk Team' },
    { key: 'platform', label: 'Platforma', placeholder: 'LinkedIn / Facebook / X' }
  ]
};

function QuestionsManager({ currentUser }) {
  const adminId = currentUser?.userId;
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [quizName, setQuizName] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [expandedQuizId, setExpandedQuizId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const refreshData = async () => {
    const [q, z] = await Promise.all([getAdminQuestions(adminId), getAdminQuizzes(adminId)]);
    setQuestions(q);
    setQuizzes(z);
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [q, z] = await Promise.all([getAdminQuestions(adminId), getAdminQuizzes(adminId)]);
        if (!isMounted) return;
        setQuestions(q);
        setQuizzes(z);
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError.message);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [adminId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetadataChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  const resetQuestionForm = () => {
    setForm(emptyForm);
    setEditingQuestionId(null);
  };

  const resetQuizForm = () => {
    setQuizName('');
    setSelectedQuestionIds([]);
    setEditingQuizId(null);
  };

  const buildTypeMetadata = () => {
    const fields = typeSpecificFields[form.type] || [];
    return fields.reduce((acc, field) => {
      const value = form.metadata[field.key]?.trim();
      if (value) {
        acc[field.key] = value;
      }
      return acc;
    }, {});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');

    const options = form.options
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    if (options.length < 2) {
      setError('Podaj co najmniej 2 opcje odpowiedzi.');
      return;
    }

    const payload = {
      name: form.name,
      type: form.type,
      content: {
        question: form.question,
        options,
        correctAnswer: Number(form.correctAnswer),
        explanation: form.explanation,
        ...buildTypeMetadata()
      }
    };

    try {
      if (editingQuestionId) {
        await updateQuestion({
          questionId: editingQuestionId,
          ...payload,
          createdBy: adminId
        });
        setStatus('Pytanie zostalo zaktualizowane.');
      } else {
        await addQuestion({ ...payload, createdBy: adminId });
        setStatus('Pytanie zostalo zapisane.');
      }

      resetQuestionForm();
      await refreshData();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const startEditQuestion = (question) => {
    const content = question.content || {};
    setError('');
    setStatus('');
    setEditingQuestionId(question.questionId);
    setForm({
      name: question.name || '',
      type: question.type || 'quiz',
      question: content.question || '',
      options: Array.isArray(content.options) ? content.options.join('\n') : '',
      correctAnswer: Number.isInteger(content.correctAnswer) ? content.correctAnswer : 0,
      explanation: content.explanation || '',
      metadata: {
        from: content.from || '',
        subject: content.subject || '',
        sender: content.sender || '',
        phone: content.phone || '',
        url: content.url || '',
        author: content.author || '',
        platform: content.platform || ''
      }
    });
  };

  const toggleQuestionInQuiz = (questionId) => {
    setSelectedQuestionIds((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      }
      return [...prev, questionId];
    });
  };

  const handleCreateQuiz = async (event) => {
    event.preventDefault();
    setStatus('');
    setError('');

    try {
      if (editingQuizId) {
        await updateQuiz({
          quizId: editingQuizId,
          name: quizName.trim(),
          questionIds: selectedQuestionIds,
          createdBy: adminId
        });
        setStatus('Quiz zostal zaktualizowany.');
      } else {
        await createQuiz({
          name: quizName.trim(),
          questionIds: selectedQuestionIds,
          createdBy: adminId
        });
        setStatus('Quiz zostal utworzony.');
      }

      resetQuizForm();
      await refreshData();
    } catch (quizError) {
      setError(quizError.message);
    }
  };

  const startEditQuiz = (quiz) => {
    setError('');
    setStatus('');
    setEditingQuizId(quiz.quizId);
    setQuizName(quiz.name);
    setSelectedQuestionIds(quiz.questionIds || []);
  };

  const askDeleteQuestion = (question) => {
    setConfirmDialog({ kind: 'question', id: question.questionId, label: question.name });
  };

  const askDeleteQuiz = (quiz) => {
    setConfirmDialog({ kind: 'quiz', id: quiz.quizId, label: quiz.name });
  };

  const confirmDelete = async () => {
    if (!confirmDialog) {
      return;
    }

    if (confirmDialog.kind === 'question') {
      await deleteQuestion(confirmDialog.id);
      if (editingQuestionId === confirmDialog.id) {
        resetQuestionForm();
      }
      await refreshData();
    }

    if (confirmDialog.kind === 'quiz') {
      await deleteQuiz(confirmDialog.id);
      if (editingQuizId === confirmDialog.id) {
        resetQuizForm();
      }
      if (expandedQuizId === confirmDialog.id) {
        setExpandedQuizId(null);
      }
      await refreshData();
    }

    setConfirmDialog(null);
  };

  const toggleExpand = (quizId) => {
    setExpandedQuizId((prev) => (prev === quizId ? null : quizId));
  };

  return (
    <div className="stack-lg questions-manager-page">
      <section className="card">
        <h1>Bank pytań</h1>
      </section>

      <section className="card">
        <h2>{editingQuestionId ? 'Edytuj pytanie' : 'Dodaj pytanie'}</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Nazwa
            <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} required />
          </label>

          <label>
            Typ
            <select value={form.type} onChange={(event) => handleChange('type', event.target.value)}>
              {typeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          {typeSpecificFields[form.type].length > 0 && (
            <div className="type-meta-grid">
              {typeSpecificFields[form.type].map((field) => (
                <label key={field.key}>
                  {field.label}
                  <input
                    value={form.metadata[field.key]}
                    onChange={(event) => handleMetadataChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    required
                  />
                </label>
              ))}
            </div>
          )}

          <label>
            Tresc pytania
            <input value={form.question} onChange={(event) => handleChange('question', event.target.value)} required />
          </label>

          <label>
            Opcje (jedna w linii)
            <textarea
              rows={5}
              value={form.options}
              onChange={(event) => handleChange('options', event.target.value)}
              placeholder={'Opcja A\nOpcja B\nOpcja C'}
              required
            />
          </label>

          <label>
            Poprawna odpowiedź (indeks, od 0)
            <input
              type="number"
              min={0}
              value={form.correctAnswer}
              onChange={(event) => handleChange('correctAnswer', event.target.value)}
              required
            />
          </label>

          <label>
            Wyjaśnienie
            <textarea rows={3} value={form.explanation} onChange={(event) => handleChange('explanation', event.target.value)} />
          </label>

          <div className="row gap wrap">
            <button className="btn btn-primary" type="submit">
              {editingQuestionId ? 'Zapisz zmiany' : 'Zapisz pytanie'}
            </button>
            {editingQuestionId && (
              <button className="btn btn-secondary" type="button" onClick={resetQuestionForm}>Anuluj edycję</button>
            )}
          </div>
        </form>

        {status && <p className="success-text">{status}</p>}
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="card">
        <h2>Lista pytań</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Typ</th>
                <th>Treść</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.questionId}>
                  <td>{question.name}</td>
                  <td>{question.type}</td>
                  <td>{question.content?.question || '-'}</td>
                  <td>
                    <div className="row gap wrap">
                      <button className="btn btn-secondary btn-sm" type="button" onClick={() => startEditQuestion(question)}>
                        Edytuj
                      </button>
                      <button className="btn btn-danger btn-sm" type="button" onClick={() => askDeleteQuestion(question)}>
                        Usuń
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>{editingQuizId ? 'Edytuj quiz' : 'Utwórz quiz'}</h2>

        <form className="form-grid" onSubmit={handleCreateQuiz}>
          <label>
            Nazwa quizu
            <input
              value={quizName}
              onChange={(event) => setQuizName(event.target.value)}
              placeholder="np. Phishing SMS Basics"
              required
            />
          </label>

          <div className="quiz-question-picker">
            {questions.length === 0 && <p className="muted">Brak pytań do przypisania.</p>}
            {questions.map((question) => {
              const checked = selectedQuestionIds.includes(question.questionId);
              return (
                <label key={question.questionId} className="picker-item">
                  <input type="checkbox" checked={checked} onChange={() => toggleQuestionInQuiz(question.questionId)} />
                  <span>[{question.type}] {question.name}</span>
                </label>
              );
            })}
          </div>

          <div className="row gap wrap">
            <button className="btn btn-primary" type="submit">
              {editingQuizId ? 'Zapisz zmiany' : 'Zapisz quiz'}
            </button>
            {editingQuizId && (
              <button className="btn btn-secondary" type="button" onClick={resetQuizForm}>Anuluj edycję</button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Lista quizów</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Pytania</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <Fragment key={quiz.quizId}>
                  <tr>
                    <td>{quiz.name}</td>
                    <td>{quiz.questionIds.length}</td>
                    <td className="row gap">
                      <button className="btn btn-secondary btn-sm" type="button" onClick={() => startEditQuiz(quiz)}>
                        Edytuj
                      </button>
                      <button className="btn btn-secondary btn-sm" type="button" onClick={() => toggleExpand(quiz.quizId)}>
                        {expandedQuizId === quiz.quizId ? 'Zwiń' : 'Szczegóły'}
                      </button>
                      <button className="btn btn-danger btn-sm" type="button" onClick={() => askDeleteQuiz(quiz)}>
                        Usuń
                      </button>
                    </td>
                  </tr>
                  {expandedQuizId === quiz.quizId && (
                    <tr className="expand-row">
                      <td colSpan={3}>
                        <div className="tag-list">
                          {quiz.questionIds.length === 0 && <span className="muted">Brak przypisanych pytań.</span>}
                          {quiz.questionIds.map((qId) => {
                            const q = questions.find((item) => item.questionId === qId);
                            return (
                              <span key={qId} className="tag">[{q ? q.type : '?'}] {q ? q.name : qId}</span>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {confirmDialog && (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirmDialog(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <h3>Potwierdź usunięcie</h3>
            <p>
              Czy na pewno chcesz usunąć: <strong>{confirmDialog.label}</strong>?
            </p>
            <div className="row gap wrap">
              <button className="btn btn-danger" type="button" onClick={confirmDelete}>Usuń</button>
              <button className="btn btn-secondary" type="button" onClick={() => setConfirmDialog(null)}>Anuluj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionsManager;
