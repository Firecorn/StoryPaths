import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Mascot from '../components/Mascot.jsx';
import { BackLink, Clouds } from '../components/AuthParts.jsx';
import { Field } from '../components/Form.jsx';
import { useGame } from '../context/GameContext.jsx';

// Not in the Canva set, but the splash screen's "Login" button needs a destination.
// Built from the Forgot Password layout so it matches.
export default function Login() {
  const { signIn } = useGame();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // TODO: call your auth API here and use the returned profile.
    signIn({ email: form.email });
    navigate('/home');
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
        <button className="btn btn--solid" type="submit">Login</button>
        <Link className="auth__link" to="/forgot-password">Forgot your password?</Link>
      </form>
      <Clouds />
    </div>
  );
}
