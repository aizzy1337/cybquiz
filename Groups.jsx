import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  assignQuizToGroup,
  createGroup,
  getAdminQuizzes,
  getGroups,
  getUserGroups,
  joinGroup,
  removeQuizFromGroup
} from '../api/cybquizApi';

function Groups({ currentUser }) {
  const isAdmin = currentUser?.role === 'admin';
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [adminQuizzes, setAdminQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const adminGroups = useMemo(
    () => (isAdmin ? allGroups.filter((g) => g.admin === currentUser.userId) : []),
    [allGroups, currentUser, isAdmin]
  );

  const loadData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [groups, userGroups, quizzes] = await Promise.all([
        getGroups(),
        getUserGroups(currentUser.userId),
        isAdmin ? getAdminQuizzes(currentUser.userId) : Promise.resolve([])
      ]);

      setAllGroups(groups);
      setMyGroups(userGroups);
      setAdminQuizzes(quizzes);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.userId, isAdmin]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      const g = await createGroup(groupName.trim(), currentUser.userId);
      setGroupName('');
      setStatus(`Grupa "${g.name}" utworzona. Kod dołączenia: ${g.joinCode}`);
      await loadData();
    } catch (createError) {
      setError(createError.message);
    }
  };

  const handleJoin = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      await joinGroup(joinCode.trim().toUpperCase(), currentUser.userId);
      setJoinCode('');
      setStatus('Dołączono do grupy!');
      await loadData();
    } catch (joinError) {
      setError(joinError.message);
    }
  };

  const toggleAssign = async (groupId, quizId, alreadyAssigned) => {
    setError('');
    setStatus('');

    try {
      if (alreadyAssigned) {
        await removeQuizFromGroup(groupId, quizId);
      } else {
        await assignQuizToGroup(groupId, quizId);
      }
      await loadData();
    } catch (assignError) {
      setError(assignError.message);
    }
  };

  if (isLoading) {
    return (
      <section className="card">
        <p>Ładowanie grup...</p>
      </section>
    );
  }

  return (
    <div className="stack-lg">
      <section className="card hero-card">
        <h1>Grupy</h1>
      </section>

      <section className="card">
        <h2>Moje grupy</h2>
        {myGroups.length === 0 && (
          <p className="muted">
            {isAdmin ? 'Nie masz jeszcze żadnych grup.' : 'Nie należysz jeszcze do żadnej grupy. Dołącz przez kod poniżej.'}
          </p>
        )}
        {myGroups.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Kod dołączenia</th>
                  <th>Członkowie</th>
                  <th>Quizy</th>
                </tr>
              </thead>
              <tbody>
                {myGroups.map((group) => (
                  <tr key={group.groupId}>
                    <td>{group.name}</td>
                    <td><code>{group.joinCode}</code></td>
                    <td>{group.userIds.length}</td>
                    <td>{group.quizIds.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isAdmin && (
        <>
          <section className="card">
            <h2>Utwórz grupę</h2>
            <form className="form-grid" onSubmit={handleCreate}>
              <label>
                Nazwa grupy
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="np. Security Team A"
                  required
                />
              </label>
              <button className="btn btn-primary" type="submit">Utwórz grupę</button>
            </form>
            {status && <p className="success-text">{status}</p>}
            {error && <p className="error-text">{error}</p>}
          </section>

          {adminGroups.length > 0 && (
            <section className="card">
              <h2>Zarządzaj quizami w grupach</h2>
              <p className="muted groups-quiz-help">
                Zaznacz quizy, które mają być dostępne w danej grupie. Jeden quiz może być przypisany do wielu grup.
              </p>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Grupa</th>
                      <th>Kod</th>
                      <th>Członkowie</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminGroups.map((group) => (
                      <Fragment key={group.groupId}>
                        <tr>
                          <td><strong>{group.name}</strong></td>
                          <td><code>{group.joinCode}</code></td>
                          <td>{group.userIds.length}</td>
                          <td>
                            <button
                              className="btn btn-secondary btn-sm"
                              type="button"
                              onClick={() => setExpandedGroupId((prev) => (prev === group.groupId ? null : group.groupId))}
                            >
                              {expandedGroupId === group.groupId ? 'Zwiń' : `Quizy (${group.quizIds.length})`}
                            </button>
                          </td>
                        </tr>
                        {expandedGroupId === group.groupId && (
                          <tr className="expand-row">
                            <td colSpan={4}>
                              {adminQuizzes.length === 0 && (
                                <p className="muted">Brak Twoich quizów. Utwórz quiz w sekcji Pytania.</p>
                              )}
                              <div className="quiz-question-picker">
                                {adminQuizzes.map((quiz) => {
                                  const assigned = group.quizIds.includes(quiz.quizId);
                                  return (
                                    <label key={quiz.quizId} className="picker-item">
                                      <input
                                        type="checkbox"
                                        checked={assigned}
                                        onChange={() => toggleAssign(group.groupId, quiz.quizId, assigned)}
                                      />
                                      <span>{quiz.name}</span>
                                      {assigned && <span className="tag">przypisany</span>}
                                    </label>
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
          )}
        </>
      )}

      {!isAdmin && (
        <section className="card">
          <h2>Dołącz do grupy</h2>
          <p className="muted">Wpisz kod dołączenia otrzymany od administratora.</p>
          <form className="form-grid" onSubmit={handleJoin}>
            <label>
              Kod dołączenia
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="np. GENERAL1"
                required
              />
            </label>
            <button className="btn btn-primary" type="submit">Dołącz</button>
          </form>
          {status && <p className="success-text">{status}</p>}
          {error && <p className="error-text">{error}</p>}
        </section>
      )}
    </div>
  );
}

export default Groups;
