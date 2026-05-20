import { useState } from 'react';
import { login, register } from '../api/cybquizApi';

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [loginValue, setLoginValue] = useState('demo');
  const [passwordValue, setPasswordValue] = useState('demo123');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const user = mode === 'login'
        ? await login(loginValue, passwordValue)
        : await register(loginValue, passwordValue);
      onAuthenticated(user);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon">🛡️</div>
        <h1 className="auth-title">CybQuiz</h1>
        <p className="auth-subtitle">Platforma szkolen z cyberbezpieczenstwa</p>
      </div>

      <div className="card">
        <h2>{mode === 'login' ? 'Zaloguj sie' : 'Utworz konto'}</h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Login
            <input
              value={loginValue}
              onChange={(event) => setLoginValue(event.target.value)}
              placeholder="np. demo"
              autoComplete="username"
              required
            />
          </label>

          <label>
            Haslo
            <input
              type="password"
              value={passwordValue}
              onChange={(event) => setPasswordValue(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary btn-full" type="submit">
            {mode === 'login' ? 'Zaloguj sie' : 'Zarejestruj sie'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? 'Nie masz konta?' : 'Masz juz konto?'}{' '}
          <button type="button" className="link-btn" onClick={switchMode}>
            {mode === 'login' ? 'Zarejestruj sie' : 'Zaloguj sie'}
          </button>
        </p>

        {mode === 'login' && (
          <p className="auth-hint">
            Demo: <code>demo</code> / <code>demo123</code>
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
