import { useState } from 'react';
import { BrowserRouter as Router, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { getCurrentUser, logout } from './api/cybquizApi';
import Auth from './pages/Auth';
import Groups from './pages/Groups';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import QuestionsManager from './pages/QuestionsManager';
import Leaderboard from './pages/Leaderboard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const isAdmin = currentUser?.role === 'admin';

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <Router>
        <div className="auth-layout">
          <Routes>
            <Route path="*" element={<Auth onAuthenticated={setCurrentUser} />} />
          </Routes>
        </div>
      </Router>
    );
  }

  const navClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;

  return (
    <Router>
      <div className="App">
        <header className="navbar">
          <div className="nav-container">
            <NavLink to="/" className="nav-logo">CybQuiz</NavLink>
            <nav className="nav-menu">
              <NavLink to="/" end className={navClass}>Dashboard</NavLink>
              <NavLink to="/quiz" className={navClass}>Quiz</NavLink>
              {isAdmin && <NavLink to="/questions" className={navClass}>Pytania</NavLink>}
              <NavLink to="/groups" className={navClass}>Grupy</NavLink>
              <NavLink to="/leaderboard" className={navClass}>Ranking</NavLink>
            </nav>
            <div className="row gap">
              <span className="user-badge">{currentUser.login}</span>
              <span className="role-badge">{isAdmin ? 'admin' : 'user'}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>Wyloguj</button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/quiz" element={<Quiz currentUser={currentUser} />} />
            <Route
              path="/questions"
              element={isAdmin ? <QuestionsManager currentUser={currentUser} /> : (
                <section className="card">
                  <h2>Brak dostepu</h2>
                  <p className="muted">Tylko administrator moze zarzadzac pytaniami i quizami.</p>
                </section>
              )}
            />
            <Route path="/groups" element={<Groups currentUser={currentUser} />} />
            <Route path="/leaderboard" element={<Leaderboard currentUser={currentUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
