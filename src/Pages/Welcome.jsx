import { Link } from 'react-router-dom';
import Mascot from '../components/Mascot.jsx';
import { Clouds } from '../components/AuthParts.jsx';

// Design: "Hi There!" splash
export default function Welcome() {
  return (
    <div className="app auth">
      <section className="auth__hero">
        <h1 className="auth__hello">Hi There!</h1>
        <Mascot variant="leaf" size={250} className="auth__mascot" />
      </section>

      <div className="auth__actions">
        <Link to="/login" className="btn btn--solid">Login</Link>
        <Link to="/signup" className="btn btn--outline">Sign up</Link>
      </div>

      <Clouds />
    </div>
  );
}
