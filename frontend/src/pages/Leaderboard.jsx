import { useEffect, useMemo, useState } from 'react';
import { getGroups, getLeaderboardForGroup, getUserScores } from '../api/cybquizApi';

function MyResults({ currentUser }) {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const loaded = await getUserScores(currentUser.userId);
        if (isMounted) {
          setScores(loaded);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [currentUser.userId]);

  if (error) {
    return (
      <section className="card">
        <p className="error-text">{error}</p>
      </section>
    );
  }

  if (scores.length === 0) {
    return (
      <section className="card">
        <p className="muted">Nie masz jeszcze zadnych wynikow. Rozwiaz quiz, aby je zobaczyc.</p>
      </section>
    );
  }

  const best = [...scores].sort((a, b) => b.accuracy - a.accuracy)[0];

  return (
    <>
      <section className="grid-3">
        <article className="card">
          <h3>Najlepszy wynik</h3>
          <p className="metric">{best.accuracy}%</p>
          <p className="muted">{best.quizName}</p>
        </article>
        <article className="card">
          <h3>Liczba prob</h3>
          <p className="metric">{scores.length}</p>
        </article>
        <article className="card">
          <h3>Srednia skutecznosc</h3>
          <p className="metric">
            {Math.round(scores.reduce((s, r) => s + r.accuracy, 0) / scores.length)}%
          </p>
        </article>
      </section>

      <section className="card">
        <h2>Historia wynikow</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Grupa</th>
                <th>Skutecznosc</th>
                <th>Poprawne / Wszystkie</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((row) => (
                <tr key={row.scoreId} className={row.accuracy === best.accuracy ? 'leaderboard-me' : ''}>
                  <td>{row.quizName}</td>
                  <td>{row.groupName}</td>
                  <td><strong>{row.accuracy}%</strong></td>
                  <td>{row.correct} / {row.total}</td>
                  <td className="muted">{new Date(row.createdAt).toLocaleDateString('pl-PL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AdminLeaderboard({ currentUser }) {
  const [myGroups, setMyGroups] = useState([]);
  const [groupFilter, setGroupFilter] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadGroups = async () => {
      try {
        const allGroups = await getGroups();
        if (isMounted) {
          setMyGroups(allGroups.filter((group) => group.admin === currentUser.userId));
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

    const loadRows = async () => {
      if (!groupFilter) {
        setRows([]);
        return;
      }

      try {
        const loaded = await getLeaderboardForGroup(groupFilter);
        if (isMounted) {
          setRows(loaded);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      }
    };

    loadRows();
    return () => {
      isMounted = false;
    };
  }, [groupFilter]);

  const selectedGroup = useMemo(
    () => myGroups.find((g) => g.groupId === groupFilter),
    [groupFilter, myGroups]
  );

  return (
    <>
      <section className="card">
        <label>
          Wybierz grupe
          <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
            <option value="">— wybierz grupe —</option>
            {myGroups.map((g) => (
              <option key={g.groupId} value={g.groupId}>{g.name}</option>
            ))}
          </select>
        </label>
        {selectedGroup && (
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            Czlonkowie: {selectedGroup.userIds.length}
          </p>
        )}
        {error && <p className="error-text">{error}</p>}
      </section>

      {!groupFilter && (
        <section className="card">
          <p className="muted">Wybierz grupe, aby zobaczyc ranking jej czlonkow.</p>
        </section>
      )}

      {groupFilter && rows.length === 0 && (
        <section className="card">
          <p className="muted">Czlonkowie tej grupy nie rozwiazali jeszcze zadnego quizu.</p>
        </section>
      )}

      {rows.length > 0 && (
        <section className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Uzytkownik</th>
                  <th>Skutecznosc</th>
                  <th>Poprawne</th>
                  <th>Wszystkie</th>
                  <th>Proby</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.userId}>
                    <td>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</td>
                    <td>{row.login}</td>
                    <td><strong>{row.accuracy}%</strong></td>
                    <td>{row.correct}</td>
                    <td>{row.total}</td>
                    <td>{row.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

function Leaderboard({ currentUser }) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="stack-lg">
      <section className="card hero-card">
        <h1>{isAdmin ? 'Ranking grup' : 'Moje wyniki'}</h1>
        <p className="muted">
          {isAdmin
            ? 'Wyniki wszystkich uzytkownikow w twoich grupach.'
            : 'Twoja historia wynikow quizow.'}
        </p>
      </section>

      {isAdmin
        ? <AdminLeaderboard currentUser={currentUser} />
        : <MyResults currentUser={currentUser} />}
    </div>
  );
}

export default Leaderboard;
