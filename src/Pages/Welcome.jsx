import { Link } from 'react-router-dom';
import { Clouds } from '../components/AuthParts.jsx';

// Design: "Hi There!" splash
export default function Welcome() {
  return (
    <div className="app auth">
      <section className="auth__hero auth__hero--art">
        <h1 className="sr-only">Hi There!</h1>
        <img className="auth__art" src="/assets/mascot-leaf.png" alt="" />
      </section>

      <div className="auth__actions">
        <Link to="/login" className="btn btn--solid">Login</Link>
        <Link to="/signup" className="btn btn--outline">Sign up</Link>
      </div>

      <Clouds />
    </div>
  );
}