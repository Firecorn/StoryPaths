
const OUTLINE = '#3a1020';
const CREAM = '#fce8bc';

const CAPS = { happy: '#fdb347', cool: '#f95f3f', leaf: '#f2643d' };

export default function Mascot({ variant = 'happy', size = 230, className = '' }) {
  return <img className={className} src={`/assets/mascot-${variant}.png`} alt="" width={size} />;
}