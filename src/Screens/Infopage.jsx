import { Navigate, useParams } from 'react-router-dom';
import Screen from '../components/Screen.jsx';

// Placeholder copy for the static settings pages. Replace with your real text.
const PAGES = {
  about: {
    title: 'About',
    body: 'Clarity Quest turns reading passages into a choose-your-path adventure. Read closely, answer text-based questions, and earn Clarity Points to explore the mountain.',
  },
  terms: { title: 'Terms & Conditions', body: 'Add your terms and conditions here.' },
  privacy: { title: 'Privacy Policy', body: 'Add your privacy policy here. Because the app is used by children, be sure to cover COPPA and FERPA.' },
  rate: { title: 'Rate This App', body: 'Link to your app-store listing here once the app is published.' },
};

export default function InfoPage() {
  const page = PAGES[useParams().slug];
  if (!page) return <Navigate to="/profile" replace />;
  return (
    <Screen title={page.title}>
      <p className="info">{page.body}</p>
    </Screen>
  );
}
