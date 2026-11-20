import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { UserAvatar } from '../components/Avatar.jsx';
import { Field, PillMultiSelect, PillSelect } from '../components/Form.jsx';
import { useGame } from '../context/GameContext.jsx';
import { GRADES, INTERESTS, READING_LEVELS } from '../data/options.js';
import { authMessage } from '../lib/authErrors.js';

// Design: Profile > Edit
export default function EditProfile() {
  const { user, updateUser, changeEmail } = useGame();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...user });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const emailChanged = form.email.trim().toLowerCase() !== user.email.toLowerCase();

  const save = async (e) => {
    e.preventDefault();
    setError('');

    // Everything except email is a normal profile update.
    const { email, ...patch } = form;
    updateUser({ ...patch, username: form.username.trim() || 'Reader' });

    if (!emailChanged) {
      navigate('/profile');
      return;
    }

    setBusy(true);
    try {
      await changeEmail(form.email.trim(), password);
      navigate('/profile', {
        state: { notice: `We sent a confirmation link to ${form.email.trim()}. Your login email changes once you click it.` },
      });
    } catch (err) {
      setError(authMessage(err));
      setBusy(false);
    }
  };

  return (
    <Screen title="Profile">
      <form className="editprofile" onSubmit={save}>
        <UserAvatar />
        <label className="sr-only" htmlFor="username">Username</label>
        <input
          id="username"
          className="editprofile__name"
          value={form.username}
          placeholder="Username"
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
        />

        <Field label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="hello@reallygreatsite.com" autoComplete="email" />

        {emailChanged && (
          <Field label="Current password (needed to change email)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        )}

        <PillSelect label="Reading level" options={READING_LEVELS} value={form.readingLevel} onChange={(readingLevel) => setForm((f) => ({ ...f, readingLevel }))} />
        <PillSelect label="Grade" options={GRADES} value={form.grade} onChange={(grade) => setForm((f) => ({ ...f, grade }))} />
        <PillMultiSelect label="Story interests" options={INTERESTS} value={form.interests} onChange={(interests) => setForm((f) => ({ ...f, interests }))} />

        {error && <p className="auth__status" role="alert">{error}</p>}
        <button className="btn btn--solid btn--save" type="submit" disabled={busy}>Save</button>
      </form>
    </Screen>
  );
}