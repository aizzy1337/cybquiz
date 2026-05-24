import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminQuizzes, getGroups, getLeaderboard, getUserGroups } from '../api/cybquizApi';

function Home({ currentUser }) {
  const isAdmin = currentUser?.role === 'admin';
  const [quizzes, setQuizzes] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setError('');
      try {
        const [loadedGroups, loadedLeaderboard, loadedMyGroups, loadedQuizzes] = await Promise.all([
          getGroups(),
          getLeaderboard(),
          getUserGroups(currentUser.userId),
          isAdmin ? getAdminQuizzes(currentUser.userId) : Promise.resolve([])
        ]);

        if (!isMounted) return;
        setAllGroups(loadedGroups);
        setLeaderboard(loadedLeaderboard);
        setMyGroups(loadedMyGroups);
        setQuizzes(loadedQuizzes);
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError.message);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [currentUser.userId, isAdmin]);

  const bestScore = useMemo(() => {
    const entry = leaderboard.find((r) => r.userId === currentUser?.userId);
    return entry ? entry.accuracy : null;
  }, [leaderboard, currentUser]);

  return (
    <div className="stack-lg">
      <section className="card hero-card">
        <h1>Witaj, {currentUser?.login}!</h1>
        <p className="muted home-hero-subtitle">
          {isAdmin
            ? 'Zarzadzaj pytaniami, quizami i grupami.'
            : 'Cwicz rozpoznawanie zagrozen: phishing SMS, falszywe e-maile, podejrzane strony i profile spolecznosciowe.'}
        </p>
        <div className="row gap wrap">
          <Link to="/quiz" className="btn btn-primary">Rozwiaz quiz</Link>
          {isAdmin && <Link to="/questions" className="btn btn-secondary">Pytania i quizy</Link>}
          <Link to="/groups" className="btn btn-secondary">{isAdmin ? 'Grupy' : 'Moje grupy'}</Link>
          <Link to="/leaderboard" className="btn btn-secondary">Ranking</Link>
        </div>
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="grid-3">
        {isAdmin ? (
          <>
            <article className="card">
              <h3>Twoje quizy</h3>
              <p className="metric">{quizzes.length}</p>
              <Link to="/questions" className="small-link">Zarzadzaj &#x2192;</Link>
            </article>
            <article className="card">
              <h3>Grupy</h3>
              <p className="metric">{allGroups.filter((g) => g.admin === currentUser.userId).length}</p>
              <Link to="/groups" className="small-link">Zarzadzaj &#x2192;</Link>
            </article>
            <article className="card">
              <h3>Uzytkownicy z wynikami</h3>
              <p className="metric">{leaderboard.length}</p>
              <Link to="/leaderboard" className="small-link">Zobacz ranking &#x2192;</Link>
            </article>
          </>
        ) : (
          <>
            <article className="card">
              <h3>Moje grupy</h3>
              <p className="metric">{myGroups.length}</p>
              <Link to="/groups" className="small-link">Dolacz &#x2192;</Link>
            </article>
            <article className="card">
              <h3>Dostepne quizy</h3>
              <p className="metric">{myGroups.reduce((acc, g) => acc + g.quizIds.length, 0)}</p>
              <Link to="/quiz" className="small-link">Rozwiaz &#x2192;</Link>
            </article>
            <article className="card">
              <h3>Twoj wynik</h3>
              <p className="metric">{bestScore !== null ? `${bestScore}%` : '\u2014'}</p>
              <Link to="/leaderboard" className="small-link">Zobacz ranking &#x2192;</Link>
            </article>
          </>
        )}
      </section>
    </div>
  );
}

export default Home;
