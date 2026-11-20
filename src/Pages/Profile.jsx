import { Link } from 'react-router-dom';
import Screen from '../components/Screen.jsx';
import {
  AlertIcon, BugIcon, ChevronRight, LockIcon, LogoutIcon, PersonIcon,
  QuestionIcon, ShareIcon, StarIcon, TrashIcon,
} from '../components/Icons.jsx';
import { useGame } from '../context/GameContext.jsx';
import { authMessage } from '../lib/authErrors.js';

// Design: Profile > settings list
export default function Profile() {
  const { logOut, deleteAccount } = useGame();

  const share = async () => {
    const data = { title: 'Clarity Quest', text: 'Read your way up the mountain!', url: window.location.origin };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        alert('Link copied!');
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  // After either of these Firebase signs the student out and <RequireAuth> in App.jsx returns them to the splash screen.
  const logout = () => logOut();

  const remove = async () => {
    if (!window.confirm('Delete your account and all progress? This cannot be undone.')) return;
    const password = window.prompt('Type your password to confirm:');
    if (!password) return;
    try {
      await deleteAccount(password);
    } catch (err) {
      alert(authMessage(err));
    }
  };

  const rows = [
    { label: 'About', Icon: QuestionIcon, to: '/info/about' },
    { label: 'Submit bugs', Icon: BugIcon, href: 'mailto:support@example.com?subject=Clarity%20Quest%20bug' },
    { label: 'Terms & Conditions', Icon: AlertIcon, to: '/info/terms' },
    { label: 'Privacy Policy', Icon: LockIcon, to: '/info/privacy' },
    { label: 'Rate This App', Icon: StarIcon, to: '/info/rate' },
    { label: 'Share This App', Icon: ShareIcon, onClick: share },
    { label: 'Logout', Icon: LogoutIcon, onClick: logout },
    { label: 'Delete account', Icon: TrashIcon, onClick: remove },
  ];

  return (
    <Screen title="Profile">
      <ul className="settings">
        <li>
          <Link to="/profile/edit" className="settings__row">
            <span className="settings__icon"><PersonIcon /></span>
            <span className="settings__label">Edit</span>
            <ChevronRight className="settings__chev" />
          </Link>
        </li>
      </ul>

      <h2 className="settings__heading">General Settings</h2>
      <ul className="settings">
        {rows.map(({ label, Icon, to, href, onClick }) => {
          const inner = (
            <>
              <span className="settings__icon"><Icon /></span>
              <span className="settings__label">{label}</span>
              <ChevronRight className="settings__chev" />
            </>
          );
          return (
            <li key={label}>
              {to ? <Link to={to} className="settings__row">{inner}</Link>
                : href ? <a href={href} className="settings__row">{inner}</a>
                : <button type="button" className="settings__row" onClick={onClick}>{inner}</button>}
            </li>
          );
        })}
      </ul>
    </Screen>
  );
}
