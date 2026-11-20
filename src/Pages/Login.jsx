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
    <div className="app auth">
      <section className="auth__hero auth__hero--compact">
        <BackLink tone="dark" />
        <h1 className="auth__title">Welcome <strong>Back!</strong></h1>
        <Mascot variant="happy" size={170} className="auth__mascot" />
      </section>

      <form className="auth__form" onSubmit={submit}>
        <Field label="Email Address" type="email" required value={form.email} onChange={set('email')} placeholder="hello@reallygreatsite.com" autoComplete="email" />
        <Field label="Password" type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete="current-password" />
        <p className="form-error" role="alert">{error}</p>
        <button className="btn btn--solid" type="submit" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
        <Link className="auth__link" to="/forgot-password">Forgot your password?</Link>
      </form>
      <Clouds />
    </div>
  );
}
