import { useState } from 'react';
import { Link } from 'react-router-dom';
import Mascot from '../components/Mascot.jsx';
import { BackLink, Clouds } from '../components/AuthParts.jsx';
import { Field } from '../components/Form.jsx';
import { useGame } from '../context/GameContext.jsx';
import { authMessage } from '../lib/authErrors.js';

export default function Login() {
  const { logIn } = useGame();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await logIn(form.email.trim(), form.password);
    } catch (err) {
      setError(authMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="app signup">
      <div className="signup__top">
        <BackLink />
        <h1 className="signup__title">Welcome<br />Back!</h1>
        <Mascot variant="login" size={200} className="signup__mascot" />
      </div>

      <form className="signup__sheet" onSubmit={submit}>
        <Field tone="dark" label="Email Address" type="email" required value={form.email} onChange={set('email')} placeholder="hello@reallygreatsite.com" autoComplete="email" />
        <Field tone="dark" label="Password" type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete="current-password" />
        <p className="form-error form-error--light" role="alert">{error}</p>
        <button className="btn btn--cream" type="submit" disabled={busy}>{busy ? 'SIGNING IN…' : 'SIGN IN'}</button>
        <Link className="auth__link auth__link--light" to="/forgot-password">Forgot Password?</Link>
      </form>
      <Clouds color="var(--cream)" />
    </div>
  );
}