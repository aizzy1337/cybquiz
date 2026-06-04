import { useMemo } from 'react';
import { getLeaderboard } from '../api/cybquizApi';

function Results() {
  const rows = useMemo(() => getLeaderboard(), []);

  const totals = rows.reduce(
    (acc, row) => {
      acc.correct += row.correct;
      acc.total += row.total;
      return acc;
    },
    { correct: 0, total: 0 }
  );

  return (
    <div className="stack-lg">
      <section className="card">
        <h1>Wyniki globalne</h1>
        <p className="muted">Widok pomocniczy oparty o model Scores.</p>
      </section>

      <section className="grid-3">
        <article className="card">
          <h3>Uzytkownicy z wynikiem</h3>
          <p className="metric">{rows.length}</p>
        </article>
        <article className="card">
          <h3>Poprawne odpowiedzi</h3>
          <p className="metric">{totals.correct}</p>
        </article>
        <article className="card">
          <h3>Wszystkie odpowiedzi</h3>
          <p className="metric">{totals.total}</p>
        </article>
      </section>
    </div>
  );
}

export default Results;
