import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Mascot from '../components/Mascot.jsx';
import { BackLink, Clouds } from '../components/AuthParts.jsx';
import { Field, PillMultiSelect, PillSelect } from '../components/Form.jsx';
import { useGame } from '../context/GameContext.jsx';
import { GRADES, INTERESTS } from '../data/options.js';

// Design: "Create an Account"
export default function SignUp() {
  const { signIn } = useGame();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', interests: [], grade: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    // TODO: send to your API; never store the password client-side.
    const { password, ...profile } = form;
    signIn({ ...profile, interests: profile.interests.length ? profile.interests : INTERESTS });
    navigate('/diagnostic'); // new accounts take the placement diagnostic first
  };

  return (
    <div className="app signup">
      <div className="signup__top">
        <BackLink />
        <h1 className="signup__title">Create an<br />Account</h1>
        <Mascot variant="happy" size={200} className="signup__mascot" />
      </div>

      <form className="signup__sheet" onSubmit={submit}>
        <Field tone="dark" label="Username" required value={form.username} onChange={set('username')} placeholder="username" autoComplete="username" />
        <Field tone="dark" label="Email Address" type="email" required value={form.email} onChange={set('email')} placeholder="hello@reallygreatsite.com" autoComplete="email" />
        <Field tone="dark" label="Password" type="password" required minLength={8} value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete="new-password" />
        <PillMultiSelect tone="dark" label="Story Preferences" options={INTERESTS} value={form.interests} onChange={(interests) => setForm((f) => ({ ...f, interests }))} />
        <PillSelect tone="dark" label="Grade" options={GRADES} value={form.grade} onChange={(grade) => setForm((f) => ({ ...f, grade }))} placeholder="Select" />
        <button className="btn btn--cream" type="submit">SIGN UP</button>
      </form>
      <Clouds color="var(--cream)" />
    </div>
  );
}
