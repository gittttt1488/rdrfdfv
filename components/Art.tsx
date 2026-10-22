'use client';
import {useId} from 'react';
import {items,defaultCharacter} from '../lib/catalog';
export function Character({character=defaultCharacter,face=false,guide,onPaint,onMove,expression}:any){const c={...defaultCharacter,...character};const uid=useId().replaceAll(':','');const clip=(n:string)=>uid+n;const shape=(region:string)=>{
 if(region==='lips')return <ellipse cx="150" cy="181" rx="19" ry="8"/>;
 if(region==='cheeks'||region==='blend')return <><ellipse cx="107" cy="160" rx="24" ry="18"/><ellipse cx="193" cy="160" rx="24" ry="18"/><ellipse cx="150" cy="170" rx="26" ry="15"/></>;
 if(region==='eyelids')return <><ellipse cx="117" cy="128" rx="20" ry="14"/><ellipse cx="183" cy="128" rx="20" ry="14"/></>;
 if(region==='eyes'||region==='lashes')return <><ellipse cx="117" cy="136" rx="21" ry="14"/><ellipse cx="183" cy="136" rx="21" ry="14"/></>;
 if(region==='brows')return <><rect x="94" y="108" width="45" height="12"/><rect x="162" y="108" width="45" height="12"/></>;
 if(region==='nails')return <><rect x="51" y="284" width="25" height="22" rx="6"/><rect x="224" y="284" width="25" height="22" rx="6"/></>;
 if(region==='hair')return <path d="M64 173V88Q65 24 150 30Q236 23 236 103V220L215 204V96Q170 107 116 69Q105 106 83 118V206L64 220Z"/>;
 return <ellipse cx="150" cy="133" rx={c.shape==='oval'?66:73} ry="79"/>;
 };return <svg className={'character '+(face?'face':'')} viewBox="0 0 300 360" role="img" aria-label={c.name+' character'} onPointerDown={onPaint} onPointerMove={onMove} style={{touchAction:onPaint?'none':undefined}}>
 <defs>{['face','cheeks','blend','lips','eyelids','eyes','lashes','brows','nails','hair'].map(r=><clipPath id={clip(r)} key={r}>{shape(r)}</clipPath>)}</defs>
 <ellipse cx="150" cy="346" rx="68" ry="8" fill="#5d4f3420"/>
 <path d="M65 175V88Q62 20 150 27Q239 23 236 106V225H64Z" fill={c.hair}/>
 <path d="M122 291V333M179 291V333" stroke={c.skin} strokeWidth="22" strokeLinecap="round"/>
 <path d="M122 334H109M179 334H192" stroke={c.shoes} strokeWidth="20" strokeLinecap="round"/>
 <path d="M101 223L67 291M199 223L234 291" stroke={c.skin} strokeWidth="23" strokeLinecap="round"/>
 <path d="M125 199L111 214L90 300Q150 316 210 300L190 215L174 199" fill={c.outfit}/><path d="M129 199Q150 222 174 199" stroke="#ffffffa0" strokeWidth="9" fill="none"/>
 <rect x="132" y="181" width="35" height="29" rx="12" fill={c.skin}/>
 <ellipse cx="150" cy="132" rx={c.shape==='oval'?66:73} ry="79" fill={c.skin}/>
 <circle cx="76" cy="142" r="13" fill={c.skin}/><circle cx="224" cy="142" r="13" fill={c.skin}/>
 <path d={c.hairStyle==='bob'?'M72 123V89Q65 29 150 36Q230 29 229 104V126L206 94L94 100Z':c.hairStyle==='curly'?'M69 118Q40 88 76 65Q56 25 105 29Q145 0 170 28Q222 12 228 63Q267 88 231 126L203 87Q150 109 110 65Q101 103 69 118Z':'M70 120V86Q63 22 152 33Q231 23 231 108L218 122Q200 89 164 91Q129 94 111 64Q100 105 70 120Z'} fill={c.hair}/>
 <path d={c.brows==='bold'?'M100 114L132 110M168 110L200 114':'M101 115Q116 106 130 113M170 113Q184 106 199 115'} stroke={c.hair} strokeWidth={c.brows==='bold'?6:4} strokeLinecap="round" fill="none"/>
 {expression==='sleep'||c.eyes==='sleepy'?<path d="M107 136Q117 144 128 136M173 136Q183 144 194 136" stroke="#483e3b" strokeWidth="4" fill="none"/>:<><ellipse cx="117" cy="137" rx={c.eyes==='wide'?9:6} ry="10" fill="#483e3b"/><ellipse cx="183" cy="137" rx={c.eyes==='wide'?9:6} ry="10" fill="#483e3b"/><circle cx="119" cy="134" r="2.5" fill="white"/><circle cx="185" cy="134" r="2.5" fill="white"/></>}
 <path d="M149 148Q142 159 153 158" stroke="#bf8e73" strokeWidth="3" fill="none" strokeLinecap="round"/>
 <ellipse cx="107" cy="161" rx="16" ry="8" fill="#e88f9338"/><ellipse cx="193" cy="161" rx="16" ry="8" fill="#e88f9338"/>
 <path d={c.mouth==='surprise'?'M145 181a6 8 0 1 0 12 0a6 8 0 1 0-12 0':'M137 178Q150 190 164 178'} fill={c.mouth==='surprise'?'#a66059':'none'} stroke="#a66059" strokeWidth="3" strokeLinecap="round"/>
 {(c.strokes||[]).map((s:any,i:number)=>{const region=items.find(t=>t.id===s.tool)?.region||'face';return <g key={i} clipPath={`url(#${clip(region)})`} opacity={s.opacity}>{s.tool==='freckle-pen'?<g fill={s.color}>{[0,1,2,3].map(n=><circle key={n} cx={s.x+n*4-6} cy={s.y+n%2*4} r="1.6"/>)}</g>:s.tool==='face-glitter'||s.tool==='nail-art-brush'?<text x={s.x-7} y={s.y+6} fontSize={s.size} fill={s.color}>✦</text>:<circle cx={s.x} cy={s.y} r={s.size} fill={s.color} style={{mixBlendMode:s.tool==='contour'?'multiply':'normal'}}/>}</g>})}
 {c.accessory!=='none'?<text x="204" y="98" fontSize="28">{c.accessory==='bow'?'🎀':'🌸'}</text>:null}
 {c.bracelet?<path d="M228 277L242 283" stroke="#b48ce6" strokeWidth="6" strokeLinecap="round"/>:null}{c.holding==='teddy'?<text x="206" y="278" fontSize="37">🧸</text>:null}{expression==='eat'?<text x="175" y="200" fontSize="26">🍓</text>:null}
 {guide?<g className="guide-target"><circle cx={guide.x} cy={guide.y} r="23" fill="white" fillOpacity=".4" stroke="#6f9574" strokeWidth="3" strokeDasharray="5 4"/><text x={guide.x-8} y={guide.y-29} fontSize="27">↓</text></g>:null}
 </svg>}
export function TownMap({onPlace}:any){const homes=[{id:'home',x:40,y:110,w:148,h:110,c:'#f3c98b',roof:'#c5a0b9',name:'HOME'},{id:'studio',x:250,y:93,w:160,h:130,c:'#f4c3d1',roof:'#bca8d8',name:'STUDIO'},{id:'cafe',x:469,y:131,w:129,h:90,c:'#c5dbce',roof:'#e2a88b',name:'CAFÉ'},{id:'arcade',x:656,y:78,w:170,h:144,c:'#c6b8e6',roof:'#efd282',name:'ARCADE'}];return <svg className="town-map" viewBox="0 0 900 340" role="img" aria-label="Interactive town map"><rect width="900" height="340" rx="28" fill="#e9f0dc"/><path d="M0 282Q180 250 360 283T900 272" stroke="#f6ecd9" strokeWidth="65" fill="none"/><path d="M0 282Q180 250 360 283T900 272" stroke="#d6cfb8" strokeWidth="2" strokeDasharray="10 12" fill="none"/>
 <circle cx="794" cy="38" r="22" fill="#f5d77f"/>{[22,205,436,623,855].map((x,i)=><g key={x}><path d={`M${x+12} 239V171`} stroke="#a79b78" strokeWidth="10"/><circle cx={x+12} cy={155+i%2*8} r="31" fill={i%2?'#a7c5a0':'#bdcc9c'}/><circle cx={x-5} cy="166" r="19" fill="#b6cba6"/></g>)}
 {homes.map(h=><g key={h.id} role="button" tabIndex={0} aria-label={'Visit '+h.name} onClick={()=>onPlace(h.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')onPlace(h.id)}} className="map-house"><rect x={h.x+4} y={h.y+8} width={h.w} height={h.h} rx="15" fill="#70836420"/><rect x={h.x} y={h.y} width={h.w} height={h.h} rx="13" fill={h.c}/><path d={`M${h.x-10} ${h.y+5}L${h.x+h.w/2} ${h.y-50}L${h.x+h.w+10} ${h.y+5}Z`} fill={h.roof}/><rect x={h.x+h.w/2-17} y={h.y+h.h-48} width="34" height="48" rx="14" fill="#fff5df"/><circle cx={h.x+h.w/2+8} cy={h.y+h.h-21} r="3" fill="#9d8b78"/>{[16,h.w-45].map(w=><g key={w}><rect x={h.x+w} y={h.y+28} width="28" height="30" rx="9" fill="#f7f8ed"/><path d={`M${h.x+w+14} ${h.y+29}V${h.y+57}M${h.x+w} ${h.y+43}H${h.x+w+28}`} stroke="#d8bca1" strokeWidth="2"/></g>)}<rect x={h.x+25} y={h.y-10} width={h.w-50} height="27" rx="8" fill="#fff9ec"/><text x={h.x+h.w/2} y={h.y+8} textAnchor="middle" fontSize="11" fontWeight="800" fill="#675a6d" letterSpacing="2">{h.name}</text></g>)}
 <g transform="translate(347 247)"><circle cx="0" cy="0" r="12" fill="#e4b397"/><path d="M-14 15Q0 7 14 15L20 43H-20Z" fill="#aca1d5"/><path d="M-12-4Q0-22 13-2" stroke="#786051" strokeWidth="8" fill="none"/><path d="M-8 43V52M8 43V52" stroke="#8f7861" strokeWidth="7"/></g>
 {[57,139,220,515,600,780,840].map((x,i)=><text key={x} x={x} y={313+i%2*14} fontSize="18">{i%2?'🌼':'🌷'}</text>)}<text x="30" y="36" fontSize="11" fill="#7f8d73" letterSpacing="3">WONDER LIVES HERE</text></svg>}
