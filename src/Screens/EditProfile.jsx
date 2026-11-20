import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import { UserAvatar } from '../components/Avatar.jsx';
import { Field, PillMultiSelect, PillSelect } from '../components/Form.jsx';
import { useGame } from '../context/GameContext.jsx';
import { GRADES, INTERESTS, READING_LEVELS } from '../data/options.js';

// Design: Profile > Edit
export default function EditProfile() {
  const { user, updateUser } = useGame();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...user });

  const save = (e) => {
    e.preventDefault();
    // TODO: PATCH /me with your API.
    updateUser(form);
    navigate('/profile');
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
        <PillSelect label="Reading level" options={READING_LEVELS} value={form.readingLevel} onChange={(readingLevel) => setForm((f) => ({ ...f, readingLevel }))} />
        <PillSelect label="Grade" options={GRADES} value={form.grade} onChange={(grade) => setForm((f) => ({ ...f, grade }))} />
        <PillMultiSelect label="Story interests" options={INTERESTS} value={form.interests} onChange={(interests) => setForm((f) => ({ ...f, interests }))} />

        <button className="btn btn--solid btn--save" type="submit">Save</button>
      </form>
    </Screen>
  );
}
