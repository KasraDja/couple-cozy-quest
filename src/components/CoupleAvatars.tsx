import { Heart, Sparkles } from 'lucide-react';

type Avatar = { skin?: string; hair?: string; outfit?: string; accessory?: string; display_name?: string };
const skinColors: Record<string,string> = { peach: '#F5BC91', tan: '#C8875E', deep: '#865239', rosy: '#E8A6A0' };
const hairColors: Record<string,string> = { dark: '#312A23', brown: '#76503A', blonde: '#D9A449', red: '#A44932' };
const outfitColors: Record<string,string> = { green: '#297A4C', pink: '#E78B90', yellow: '#F2BD56', blue: '#6092A4' };

function colors(avatar: Avatar) {
  return {
    skin: skinColors[avatar.skin || 'peach'] || skinColors['peach'],
    hair: hairColors[avatar.hair || 'dark'] || hairColors['dark'],
    shirt: outfitColors[avatar.outfit || 'green'] || outfitColors['green'],
  };
}

// Accessory artwork is drawn for a head centred at (75,80) with radii 38×48; `scale` fits it to a smaller head centred at the origin.
function Accessory({ kind, scale }: { kind: string | undefined; scale: number }) {
  return <g transform={`scale(${scale}) translate(-75 -80)`}>
    {kind === 'glasses' && <g fill="none" stroke="#32352A" strokeWidth="3"><circle cx="58" cy="81" r="11"/><circle cx="91" cy="81" r="11"/><path d="M69 79 Q75 75 80 79"/></g>}
    {kind === 'crown' && <path d="M49 29 L48 7 L61 18 L75 4 L89 18 L103 7 L100 29Z" fill="#F6C653" stroke="#A96E2B" strokeWidth="2"/>}
    {kind === 'bow' && <g fill="#EF8692"><path d="M80 37 Q65 20 61 31 Q61 41 80 40 Q99 21 104 31 Q106 43 81 41Z"/><circle cx="81" cy="39" r="5"/></g>}
    {kind === 'cap' && <g fill="#E6B85C"><path d="M37 49 Q40 18 77 19 Q103 19 111 45 L37 50Z"/><path d="M76 45 Q113 39 127 47 Q102 58 76 50Z"/></g>}
  </g>;
}

function Eyes({ x, y, lashes = false }: { x: number; y: number; lashes?: boolean }) {
  return <g>
    {[-x, x].map(ex => <g key={ex}>
      <ellipse cx={ex} cy={y} rx="3.2" ry="4" fill="#2B211C"/>
      <circle cx={ex + 1} cy={y - 1.3} r="1.1" fill="#fff"/>
      {lashes && <path d={ex < 0 ? `M${ex - 3} ${y - 2.5} L${ex - 6} ${y - 5}` : `M${ex + 3} ${y - 2.5} L${ex + 6} ${y - 5}`} stroke="#2B211C" strokeWidth="1.6" strokeLinecap="round"/>}
    </g>)}
  </g>;
}

// Local coordinates: head centre at (0,0), feet on y=174.
function ManBody({ avatar }: { avatar: Avatar }) {
  const { skin, hair, shirt } = colors(avatar);
  return <g>
    <path d="M-33 114 L-30 168 L-7 168 L-2 124 L2 124 L7 168 L30 168 L33 114Z" fill="#34405A"/>
    <ellipse cx="-18" cy="170" rx="13" ry="5" fill="#3A2A22"/><ellipse cx="18" cy="170" rx="13" ry="5" fill="#3A2A22"/>
    <path d="M-9 20 L-9 44 L9 44 L9 20Z" fill={skin}/>
    <path d="M-34 42 Q-44 46 -42 66 L-35 118 L35 118 L42 66 Q44 46 34 42 L12 37 L0 52 L-12 37Z" fill={shirt}/>
    <path d="M-12 37 L0 52 L12 37" fill="none" stroke="#000" strokeOpacity=".15" strokeWidth="2"/>
    <ellipse cx="-26" cy="3" rx="5" ry="7" fill={skin}/><ellipse cx="26" cy="3" rx="5" ry="7" fill={skin}/>
    <ellipse cx="0" cy="0" rx="26" ry="30" fill={skin}/>
    <ellipse cx="0" cy="-17" rx="24" ry="15" fill={hair}/>
    {[...Array(9)].map((_, i) => { const a = Math.PI * (1.08 + i * 0.105); return <circle key={i} cx={29 * Math.cos(a)} cy={-5 + 31 * Math.sin(a)} r="9.5" fill={hair}/>; })}
    {[-14, 0, 14].map(x => <path key={x} d={`M${x - 5} -26 q5 -6 10 0`} fill="none" stroke="#000" strokeOpacity=".2" strokeWidth="1.5"/>)}
    <path d="M-25 0 Q-27 34 0 39 Q27 34 25 0 Q22 17 12 20 Q0 15 -12 20 Q-22 17 -25 0Z" fill={hair}/>
    <path d="M-12 17 Q0 10 12 17 Q0 14 -12 17Z" fill={hair}/>
    <path d="M-5 21 Q0 24.5 5 21" fill="none" stroke="#E8A091" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M-16 -8 Q-10 -12 -4 -8 M4 -8 Q10 -12 16 -8" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round"/>
    <Eyes x={10} y={1}/>
    <path d="M1 5 Q4 10 -1 11" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="1.8" strokeLinecap="round"/>
    <Accessory kind={avatar.accessory} scale={0.68}/>
  </g>;
}

function ManOuterArm({ avatar }: { avatar: Avatar }) {
  const { skin, shirt } = colors(avatar);
  return <g>
    <path d="M-51 78 L-51 110 L-40 110 L-40 80Z" fill={skin}/>
    <circle cx="-45.5" cy="114" r="7.5" fill={skin}/>
    <path d="M-34 43 Q-51 51 -51 82 L-40 84 Q-40 63 -30 56Z" fill={shirt}/>
  </g>;
}

// Local coordinates: head centre at (0,0), feet on y=164.
function WomanBody({ avatar }: { avatar: Avatar }) {
  const { skin, hair, shirt } = colors(avatar);
  return <g>
    <path d="M-30 -6 Q-35 -35 0 -36 Q35 -35 30 -6 L34 40 Q22 48 12 38 L-12 38 Q-22 48 -34 40Z" fill={hair}/>
    <path d="M-14 136 L-15 158 L-7 158 L-6 136Z M14 136 L15 158 L7 158 L6 136Z" fill={skin}/>
    <ellipse cx="-11" cy="160" rx="8" ry="4" fill="#8E3B4A"/><ellipse cx="11" cy="160" rx="8" ry="4" fill="#8E3B4A"/>
    <path d="M-25 86 L-38 136 Q0 145 38 136 L25 86Z" fill={shirt}/>
    <path d="M-25 86 L-38 136 Q0 145 38 136 L25 86Z" fill="#000" fillOpacity=".12"/>
    <path d="M28 44 Q40 51 40 70 L32 72 Q31 58 24 52Z" fill={shirt}/>
    <path d="M40 68 L42 100 L34 100 L32 70Z" fill={skin}/>
    <circle cx="38" cy="104" r="6" fill={skin}/>
    <path d="M-7 20 L-7 38 L7 38 L7 20Z" fill={skin}/>
    <path d="M-26 38 Q-36 42 -34 58 L-26 90 L26 90 L34 58 Q36 42 26 38 L10 34 Q0 44 -10 34Z" fill={shirt}/>
    <ellipse cx="0" cy="0" rx="24" ry="28" fill={skin}/>
    <path d="M-25 -3 Q-29 -31 0 -31 Q27 -31 26 -5 Q15 -21 -3 -18 Q-14 -10 -25 -3Z" fill={hair}/>
    <path d="M-14 -8 Q-9 -10.5 -4 -8.5 M4 -8.5 Q9 -10.5 14 -8" fill="none" stroke={hair} strokeWidth="2" strokeLinecap="round"/>
    <Eyes x={9} y={2} lashes/>
    <path d="M0 6 Q2 10 -1 11" fill="none" stroke="#000" strokeOpacity=".2" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M-5 17 Q0 21 5 17" fill="none" stroke="#C85A6A" strokeWidth="2.5" strokeLinecap="round"/>
    <ellipse cx="-15" cy="11" rx="5" ry="2.5" fill="#DF837B" opacity=".45"/><ellipse cx="15" cy="11" rx="5" ry="2.5" fill="#DF837B" opacity=".45"/>
    <Accessory kind={avatar.accessory} scale={0.63}/>
  </g>;
}

export function CoupleAvatars({ man, woman, compact = false }: { man?: Avatar | null; woman?: Avatar | null; compact?: boolean }) {
  const him = man || { display_name: 'Him', outfit: 'green', hair: 'dark', skin: 'tan' };
  const her = woman || { display_name: 'Her', outfit: 'pink', hair: 'brown' };
  const manAt = 'translate(118 64) rotate(4 0 174)';
  const womanAt = 'translate(184 74) rotate(-5 0 164)';
  return <div className={`couple-scene ${compact ? 'couple-scene-compact' : ''}`}>
    <span className="scene-spark scene-spark-one"><Sparkles size={22}/></span>
    <span className="scene-heart"><Heart size={31} fill="currentColor" strokeWidth={1.5}/></span>
    <span className="scene-spark scene-spark-two"><Sparkles size={17}/></span>
    <svg viewBox="0 0 300 250" role="img" aria-label={`${him.display_name || 'Him'} and ${her.display_name || 'Her'} in a side hug`} className="couple-svg">
      <ellipse cx="150" cy="240" rx="95" ry="8" fill="#173A2B" opacity=".1"/>
      <g className="couple-sway">
        <g transform={womanAt}><WomanBody avatar={her}/></g>
        <g transform={manAt}><ManBody avatar={him}/></g>
        <g transform={manAt}><ManOuterArm avatar={him}/></g>
        {/* His arm is around her shoulders; his hand rests on her far shoulder. */}
        <g transform={womanAt}><path d="M6 37 Q18 33 27 38 L26 46 Q17 42 7 45Z" fill={colors(him).skin}/><ellipse cx="29" cy="42" rx="6.5" ry="5.5" fill={colors(him).skin}/></g>
      </g>
    </svg>
  </div>;
}
