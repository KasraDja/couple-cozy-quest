import { Heart, Sparkles } from 'lucide-react';

type Avatar = { skin?: string; hair?: string; outfit?: string; accessory?: string; display_name?: string };
const skinColors: Record<string,string> = { peach: '#F5BC91', tan: '#C8875E', deep: '#865239', rosy: '#E8A6A0' };
const hairColors: Record<string,string> = { dark: '#312A23', brown: '#76503A', blonde: '#D9A449', red: '#A44932' };
const outfitColors: Record<string,string> = { green: '#297A4C', pink: '#E78B90', yellow: '#F2BD56', blue: '#6092A4' };

function Person({ avatar, flip = false }: { avatar: Avatar; flip?: boolean }) {
  const skin = skinColors[avatar.skin || 'peach'] || skinColors.peach;
  const hair = hairColors[avatar.hair || 'dark'] || hairColors.dark;
  const shirt = outfitColors[avatar.outfit || 'green'] || outfitColors.green;
  return <svg viewBox="0 0 150 215" role="img" aria-label={`${avatar.display_name || 'Your partner'} avatar`} className={`avatar-person ${flip ? 'avatar-flip' : ''}`}>
    <ellipse cx="75" cy="207" rx="55" ry="7" fill="#173A2B" opacity=".1" />
    <path d="M36 142 Q28 143 21 187 Q19 197 32 199 L48 199 L58 150Z" fill={skin}/>
    <path d="M113 142 Q123 147 132 186 Q134 199 121 199 L105 198 L94 150Z" fill={skin}/>
    <path d="M33 190 L46 193 L45 208 L27 207Z M120 191 L107 194 L109 208 L127 207Z" fill={skin}/>
    <path d="M38 153 Q39 129 65 126 L86 126 Q112 129 113 154 L119 204 L31 204Z" fill={shirt}/>
    <path d="M65 122 L64 137 Q75 151 87 137 L86 121Z" fill={skin}/>
    <path d="M36 70 Q31 21 72 19 Q115 19 115 70 L110 94 L40 94Z" fill={hair}/>
    <ellipse cx="75" cy="80" rx="38" ry="48" fill={skin}/>
    <path d="M36 68 Q33 32 62 24 Q90 17 108 41 Q110 57 106 65 Q87 55 78 42 Q63 59 36 68Z" fill={hair}/>
    <ellipse cx="58" cy="80" rx="3" ry="4" fill="#30251F"/><ellipse cx="91" cy="80" rx="3" ry="4" fill="#30251F"/>
    <path d="M68 98 Q75 105 83 98" fill="none" stroke="#7A453A" strokeWidth="2.5" strokeLinecap="round"/>
    <ellipse cx="47" cy="91" rx="7" ry="3" fill="#DF837B" opacity=".4"/><ellipse cx="103" cy="91" rx="7" ry="3" fill="#DF837B" opacity=".4"/>
    {avatar.accessory === 'glasses' && <g fill="none" stroke="#32352A" strokeWidth="3"><circle cx="58" cy="81" r="11"/><circle cx="91" cy="81" r="11"/><path d="M69 79 Q75 75 80 79"/></g>}
    {avatar.accessory === 'crown' && <path d="M49 29 L48 7 L61 18 L75 4 L89 18 L103 7 L100 29Z" fill="#F6C653" stroke="#A96E2B" strokeWidth="2"/>}
    {avatar.accessory === 'bow' && <g fill="#EF8692"><path d="M80 37 Q65 20 61 31 Q61 41 80 40 Q99 21 104 31 Q106 43 81 41Z"/><circle cx="81" cy="39" r="5"/></g>}
    {avatar.accessory === 'cap' && <g fill="#E6B85C"><path d="M37 49 Q40 18 77 19 Q103 19 111 45 L37 50Z"/><path d="M76 45 Q113 39 127 47 Q102 58 76 50Z"/></g>}
  </svg>;
}
export function CoupleAvatars({ first, second, compact = false }: { first?: Avatar | null; second?: Avatar | null; compact?: boolean }) {
  return <div className={`couple-scene ${compact ? 'couple-scene-compact' : ''}`}>
    <span className="scene-spark scene-spark-one"><Sparkles size={22}/></span>
    <span className="scene-heart"><Heart size={31} fill="currentColor" strokeWidth={1.5}/></span>
    <span className="scene-spark scene-spark-two"><Sparkles size={17}/></span>
    <Person avatar={first || { display_name: 'You', outfit: 'green', hair: 'dark' }}/>
    <Person avatar={second || { display_name: 'Your person', outfit: 'pink', hair: 'brown', skin: 'tan' }} flip/>
  </div>;
}
