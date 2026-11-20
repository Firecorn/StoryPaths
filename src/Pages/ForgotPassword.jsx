import { useState } from 'react';
import Mascot from '../components/Mascot.jsx';
import { BackLink, Clouds } from '../components/AuthParts.jsx';

// Design: "Oh No! I Forgot My Password"
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', text: '' });


  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', text: 'Sending…' });
    try {
      await resetPassword(email.trim());
      setStatus({ type: 'sent', text: 'Check your inbox for a reset link.' });
    } catch (err) {
      setStatus({ type: 'error', text: authMessage(err) });
    }
  };

  return (
    <div className="app auth">
      <section className="auth__hero">
        <BackLink tone="dark" />
        <h1 className="auth__title">
          Oh No! I Forgot
          <strong>My Password</strong>
        </h1>
        <Mascot variant="cool" size={230} className="auth__mascot" />
      </section>

      <form className="auth__form auth__form--center" onSubmit={submit}>
        <p className="auth__blurb">
          Don&apos;t worry, it happens to the best of us!
          <br />
          Enter your email to reset your password.
        </p>

        <label className="sr-only" htmlFor="reset-email">Email address</label>
        <input
          id="reset-email"
          className="btn btn--outline btn--input"
          type="email"
          required
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <button className="btn btn--solid btn--small" type="submit">SEND</button>
        <p className="auth__status" role="status">{sent ? 'Check your inbox for a reset link.' : ''}</p>
      </form>

      <Clouds />
    </div>
  );
}
