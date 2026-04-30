import { useState, useEffect, useCallback, useRef } from 'react';


// ── STORAGE ─────────────────────────────────────────────────────────────────
const SK = "benda-v4";
const defProg = () => ({ bikeQuiz: {}, generalQuiz: { best: 0, total: 0, attempts: 0 }, scenarios: { completed: 0, correct: 0, attempts: 0 } });
function useProg() {
const [p, sP] = useState(defProg);
const ld = useRef(false);
useEffect(() => { (async () => { try { const r = await window.storage.get(SK); if (r?.value) sP(JSON.parse(r.value)); } catch {} ld.current = true; })(); }, []);
const up = useCallback((fn) => { sP(prev => { const n = fn(JSON.parse(JSON.stringify(prev))); if (ld.current)(async()=>{try{await window.storage.set(SK,JSON.stringify(n))}catch{}})(); return n; }); }, []);
const rst = useCallback(async () => { const d = defProg(); sP(d); try { await window.storage.set(SK, JSON.stringify(d)); } catch {} }, []);
return { p, up, rst };
}

// ── COLOURS — TRUE BENDA MONOCHROME ─────────────────────────────────────────
const C = {
bg: "#000000", s1: "#0d0d0d", s2: "#141414", s3: "#1a1a1a",
border: "#3f3f46", borderL: "#52525b",
text: "#fafafa", t2: "#a1a1aa", t3: "#71717a", t4: "#52525b",
// Clean white accent
accent: "#ffffff", accentDim: "#d4d4d8", accentGlow: "rgba(255,255,255,0.08)", accentBorder: "#e4e4e7",
ok: "#22c55e", okTxt: "#4ade80", okBg: "rgba(34,197,94,0.08)", okBdr: "#166534",
no: "#ef4444", noTxt: "#f87171", noBg: "rgba(239,68,68,0.08)", noBdr: "#7f1d1d",
tE: "#ffffff", tS: "#a1a1aa", tD: "#71717a", tW: "#52525b",
};

function getTier(pct) {
if (pct === 100) return { label: "EXPERT", color: C.tE, msg: "Perfect score. You own this material.", icon: "◆" };
if (pct >= 75) return { label: "STRONG", color: C.tS, msg: "Solid knowledge. Close a couple of gaps and you're there.", icon: "▲" };
if (pct >= 50) return { label: "DEVELOPING", color: C.tD, msg: "Getting there. Review what you missed and go again.", icon: "●" };
return { label: "NEEDS WORK", color: C.tW, msg: "Spend time on the Learn tab before your next attempt.", icon: "○" };
}

// ── BIKES ────────────────────────────────────────────────────────────────────
const BIKES=[
{id:"nb250",name:"Napoleonbob 250",type:"Entry Bobber",price:"$8,990",icon:"/BendaBikeIcons/napbob250.png",
thumb:null,
img:null,
sellingPoints:[{title:"Opening pitch",text:"Perfect first bike for someone who doesn't want to look like they're on a learner. LAMS approved, dead easy to ride, and cheap to run."},{title:"Vs competitors",text:"Up against the Honda Rebel 300 and Yamaha V-Star 250 — but the NB250 has a V-twin engine and that unique front suspension at a similar price. Hard to beat for the money."},{title:"Ideal customer",text:"Anyone drawn to the bobber style who wants something that's easy to ride and cheap to run. The 250 doesn't look or feel like an entry-level bike."},{title:"Overcome objection",text:"\"Won't I grow out of it?\" — plenty of riders keep a 250 as a city bike even after upgrading. At 3.1L/100km it costs almost nothing to run."}],
anchors:{type:"Retro bobber",feel:"Light and easy to throw around — a genuinely fun ride",who:"Anyone who loves the bobber look — whether it's their first bike or their fifth"},
captions:[{label:"Style",value:"Classic bobber stance"},{label:"Suspension",value:"Unique multi-link fork"},{label:"Weight",value:"182kg - lightest in range"},{label:"Licence",value:"LAMS approved"}],
facts:[{title:"Unique front suspension",desc:"Uses a multi-link fork instead of a standard telescopic - reduces front-end dive under braking. Rare on a small bike."},{title:"LAMS approved",desc:"At 249cc it qualifies as a learner-approved motorcycle in most Australian states."},{title:"Most fuel efficient",desc:"Sips just 3.1L/100km. The 9.5L tank gives roughly 300km of range - best in the range."},{title:"Modern safety, retro look",desc:"Old-school torpedo exhaust and bobber design, but ABS and traction control come standard."},{title:"Most colour options",desc:"5 colours - Retro Green, Titanium, Phantom Black, Jazz Red, and Ivory White."}],
stats:[{val:"19kW",key:"Max Power"},{val:"25Nm",key:"Torque"},{val:"182kg",key:"Weight"},{val:"748mm",key:"Seat"}],
specs:[{group:"Engine",rows:[["Type","V2, 8v, liquid-cooled"],["Displacement","249cc"],["Max Power","19kW @ 9,000rpm"],["Max Torque","25Nm @ 5,500rpm"],["Transmission","Chain Drive"],["Fuel Use","3.1L/100km"]]},{group:"Dimensions",rows:[["Seat Height","748mm"],["Curb Weight","182kg"],["Fuel Tank","9.5L"],["Wheelbase","1,545mm"],["Front Tyre","130/80 R18"],["Rear Tyre","160/70 R18"]]},{group:"Chassis",rows:[["Front Susp","Multi-link fork"],["Rear Susp","Dual hydraulic"],["Front Brake","320mm single disc"],["Rear Brake","260mm single disc"],["Display","3-inch round TFT"],["Safety","ABS, TCS"],["Colours","Retro Green / Titanium / Phantom Black / Jazz Red / Ivory White"]]}],
flashcards:[{front:"Engine type",back:"V2, 8-valve, liquid-cooled"},{front:"Displacement",back:"249cc"},{front:"Max power",back:"19kW @ 9,000rpm"},{front:"Max torque",back:"25Nm @ 5,500rpm"},{front:"Fuel consumption",back:"3.1L/100km - best in range"},{front:"Seat height",back:"748mm - tallest in range"},{front:"Curb weight",back:"182kg - lightest in range"},{front:"Front suspension",back:"Multi-link fork (unique)"},{front:"Transmission",back:"Chain drive"},{front:"LAMS status",back:"Approved - learner legal"},{front:"Tank capacity",back:"9.5L - ~300km range"},{front:"Colour count",back:"5 - most of any Benda"}],
questions:{
easy:[{q:"What body style is the Napoleonbob 250?",a:"Bobber",opts:["Cruiser","Bobber","Cafe Racer","Adventure"],fact:"The Napoleonbob 250 is a retro bobber.",tab:"Learn",section:"Type"},{q:"Is the Napoleonbob 250 LAMS approved?",a:"Yes",opts:["Yes","No","Only in some states","Only for under 25s"],fact:"At 249cc it is LAMS eligible in most Australian states.",tab:"Learn",section:"Who it's for"},{q:"Who is the Napoleonbob 250 best suited for?",a:"Learners and new riders",opts:["Experienced tourers","Learners and new riders","Track day riders","Long-distance riders"],fact:"Light, LAMS approved, easy to handle.",tab:"Learn",section:"Who it's for"},{q:"How many colour options does the Napoleonbob 250 have?",a:"5",opts:["3","4","5","6"],fact:"Retro Green, Titanium, Phantom Black, Jazz Red, and Ivory White.",tab:"Specs",section:"Colours"},{q:"What is the lightest bike in the Benda range?",a:"Napoleonbob 250",opts:["Napoleonbob 250","Chinchilla 500","Dark Flag 500 Commander","LFC 700"],fact:"At 182kg the 250 is the lightest.",tab:"Learn",section:"Key Facts"}],
medium:[{q:"What type of front suspension does the Napoleonbob 250 use?",a:"Multi-link fork",opts:["Telescopic fork","USD fork","Multi-link fork","Earles fork"],fact:"The multi-link fork is uncommon at this price point.",tab:"Learn",section:"Key Facts"},{q:"What is the Napoleonbob 250 fuel consumption?",a:"3.1L/100km",opts:["4.5L/100km","5.9L/100km","3.1L/100km","2.8L/100km"],fact:"Most efficient in the range.",tab:"Specs",section:"Engine"},{q:"What is the seat height of the Napoleonbob 250?",a:"748mm",opts:["695mm","720mm","748mm","770mm"],fact:"At 748mm it is the tallest seat in the range.",tab:"Specs",section:"Dimensions"},{q:"What transmission does the Napoleonbob 250 use?",a:"Chain Drive",opts:["Belt Drive","Shaft Drive","Chain Drive","Direct Drive"],fact:"Chain drive - unlike the 500cc models which use belt.",tab:"Specs",section:"Engine"},{q:"What is the fuel tank capacity?",a:"9.5L",opts:["9.5L","12L","16L","14L"],fact:"9.5L - smallest tank but best economy.",tab:"Specs",section:"Dimensions"}],
hard:[{q:"What is the bore x stroke of the Napoleonbob 250?",a:"53.5 x 55.4mm",opts:["69 x 63.6mm","53.5 x 55.4mm","67 x 48mm","53.5 x 55.2mm"],fact:"53.5 x 55.4mm - near-square configuration.",tab:"Specs",section:"Engine"},{q:"What is the compression ratio?",a:"11.8:1",opts:["11.5:1","11.4:1","11.8:1","12.1:1"],fact:"11.8:1 - highest in the Benda range.",tab:"Specs",section:"Engine"},{q:"What is the front tyre spec?",a:"130/80 R18",opts:["150/80 R16","130/70 R19","130/80 R18","150/70 R17"],fact:"130/80 R18 - 18-inch wheels.",tab:"Specs",section:"Dimensions"},{q:"What is the wheelbase?",a:"1,545mm",opts:["1,550mm","1,545mm","1,720mm","1,856mm"],fact:"1,545mm - nearly identical to the NB500.",tab:"Specs",section:"Dimensions"},{q:"What is the estimated range from a full tank?",a:"~300km",opts:["~200km","~250km","~300km","~350km"],fact:"9.5L at 3.1L/100km is approx 300km.",tab:"Learn",section:"Key Facts"}]}},
{id:"nb500",name:"Napoleonbob 500",type:"Mid Bobber",price:"$11,990",icon:"/BendaBikeIcons/Napbob500.png",
thumb:null,
img:null,
sellingPoints:[{title:"Opening pitch",text:"Same bobber DNA as the 250, but with a proper V-twin and belt drive. The bike your customer grows into."},{title:"Vs competitors",text:"Sits against Honda Rebel 500 and Kawasaki Vulcan S. Belt drive and floating tail are genuine differentiators."},{title:"Ideal customer",text:"Rider who's done their time on a learner bike and wants more power without going full cruiser."},{title:"Overcome objection",text:"'Isn't the Chinchilla the same?' - Same engine, completely different personality. Let them sit on both."}],
anchors:{type:"Mid-size bobber",feel:"More go than the 250, still easy to live with — belt drive keeps things quiet and smooth",who:"Anyone who loves the bobber look and wants more grunt — suits all experience levels"},
captions:[{label:"Style",value:"Floating tail - futuristic detail"},{label:"Engine",value:"V-twin shared with Chinchilla 500"},{label:"Seat",value:"695mm - lower than the 250"},{label:"Licence",value:"LAMS approved"}],
facts:[{title:"Sits lower than the 250",desc:"695mm seat height - 53mm lower than the Napoleonbob 250."},{title:"Same engine as Chinchilla 500",desc:"Identical 475.6cc V-twin, 35kW, 42Nm."},{title:"Belt drive",desc:"Unlike the 250's chain drive. Quieter, lower maintenance."},{title:"Floating short tail",desc:"A futuristic detail that sets it apart from traditional bobbers."},{title:"Phantom Black (gold rims)",desc:"Black body with gold rims - popular colourway."}],
stats:[{val:"35kW",key:"Max Power"},{val:"42Nm",key:"Torque"},{val:"215kg",key:"Weight"},{val:"695mm",key:"Seat"}],
specs:[{group:"Engine",rows:[["Type","V2, 8v, liquid-cooled"],["Displacement","475.6cc"],["Max Power","35kW @ 9,000rpm"],["Max Torque","42Nm @ 7,200rpm"],["Transmission","Belt Drive"],["Fuel Use","4.5L/100km"]]},{group:"Dimensions",rows:[["Seat Height","695mm"],["Curb Weight","215kg"],["Fuel Tank","16L"],["Wheelbase","1,550mm"],["Front Tyre","150/80 R16"],["Rear Tyre","180/65 R16"]]},{group:"Chassis",rows:[["Front Susp","Telescopic fork"],["Rear Susp","Mono hydraulic"],["Front Brake","320mm single disc"],["Rear Brake","260mm single disc"],["Display","3-inch round TFT"],["Safety","ABS, TCS"],["Colours","Phantom Black (gold rims) / Phantom Black (black rims) / Grey Moon (black rims) / Grey Moon (grey rims)"]]}],
flashcards:[{front:"Engine type",back:"V2, 8-valve, liquid-cooled"},{front:"Displacement",back:"475.6cc (same as Chinchilla)"},{front:"Max power",back:"35kW @ 9,000rpm"},{front:"Seat height",back:"695mm - 53mm lower than 250"},{front:"Transmission",back:"Belt drive (not chain)"},{front:"Fuel tank",back:"16L"},{front:"Signature design",back:"Floating short tail"},{front:"Front suspension",back:"Telescopic fork"},{front:"Colours",back:"4 - Phantom Black (gold rims), Phantom Black (black rims), Grey Moon (black rims), Grey Moon (grey rims)"},{front:"Fuel consumption",back:"4.5L/100km"}],
questions:{
easy:[{q:"What transmission does the Napoleonbob 500 use?",a:"Belt Drive",opts:["Chain Drive","Belt Drive","Shaft Drive","Direct Drive"],fact:"Belt drive - quieter and lower maintenance."},{q:"Which model shares the same engine?",a:"Chinchilla 500",opts:["Dark Flag 500 Commander","LFC 700","Chinchilla 500","Napoleonbob 250"],fact:"Same 475.6cc V-twin, 35kW, 42Nm."},{q:"Who is the NB500 best suited for?",a:"Confident riders wanting a V-twin without bulk",opts:["Complete beginners","Confident riders wanting a V-twin without bulk","Long-distance tourers","Off-road riders"],fact:"Good step up for riders ready for more."},{q:"How many colours available?",a:"4",opts:["2","3","4","5"],fact:"Phantom Black (gold rims), Phantom Black (black rims), Grey Moon (black rims), Grey Moon (grey rims)."},{q:"What is the signature design feature?",a:"Floating short tail",opts:["Twin exhausts","Torpedo exhaust","Floating short tail","LED bar headlight"],fact:"Futuristic edge over traditional bobbers."}],
medium:[{q:"What is the seat height of the NB500?",a:"695mm",opts:["748mm","720mm","695mm","670mm"],fact:"53mm lower than the 250."},{q:"What type of front fork?",a:"Telescopic fork",opts:["Multi-link fork","USD fork","Telescopic fork","Earles fork"],fact:"Standard telescopic - unlike the 250's multi-link."},{q:"What is the fuel tank size?",a:"16L",opts:["9.5L","12L","16L","18L"],fact:"16L - considerably larger than the 250."},{q:"How much heavier than the 250?",a:"33kg",opts:["20kg","33kg","45kg","55kg"],fact:"215kg vs 182kg."}],
hard:[{q:"What is the bore x stroke?",a:"69 x 63.6mm",opts:["53.5 x 55.4mm","69 x 63.6mm","67 x 48mm","53.5 x 55.2mm"],fact:"Longer stroke, more torque at lower revs."},{q:"Rear tyre spec?",a:"180/65 R16",opts:["160/70 R18","180/65 R16","150/80 R16","310/35 R18"],fact:"16-inch wheels, wider rear."},{q:"Ground clearance?",a:"150mm",opts:["120mm","135mm","150mm","160mm"],fact:"150mm - 30mm more than the 250."},{q:"Rear suspension travel?",a:"30mm",opts:["38mm","65mm","30mm","61.5mm"],fact:"30mm - lower firmer stance."},{q:"Peak torque RPM?",a:"7,200rpm",opts:["5,500rpm","7,200rpm","9,000rpm","8,600rpm"],fact:"42Nm @ 7,200rpm."}]}},
{id:"ch500",name:"Chinchilla 500",type:"City Cruiser",price:"$9,990",icon:"/BendaBikeIcons/Chinchilla.png",
thumb:null,
img:null,
sellingPoints:[{title:"Opening pitch",text:"A classic cruiser with modern tech underneath. Twin exhausts, USD forks, belt drive - under $11k."},{title:"Vs competitors",text:"Takes on Honda Rebel 500 and Kawasaki Vulcan S. USD forks and twin-exhaust give a more premium feel."},{title:"Ideal customer",text:"Rider who loves traditional cruiser aesthetics. Wants to look and feel like a cruiser rider on weekends."},{title:"Overcome objection",text:"'What's different from the NB500?' - Same engine, completely different personality. Sit them on both."}],
anchors:{type:"Classic cruiser",feel:"Low and planted — comfortable in traffic and happy on a longer run",who:"Anyone who loves the classic cruiser look — accessible for new riders, satisfying for experienced ones"},
captions:[{label:"Style",value:"Twin exhausts - proper cruiser sound"},{label:"Forks",value:"USD - sportsbike tech on a cruiser"},{label:"Engine",value:"Same V-twin as NB500"},{label:"Licence",value:"LAMS approved"}],
facts:[{title:"Same engine as NB500",desc:"Identical 475.6cc V-twin. Different body style, same heart."},{title:"USD front fork",desc:"Stiffer under braking - normally found on sportsbikes."},{title:"Twin exhausts",desc:"Dual pipes give classic cruiser look and richer sound."},{title:"Belt drive",desc:"Low maintenance, no chain lube, quieter."},{title:"10mm higher than NB500",desc:"705mm vs 695mm."}],
stats:[{val:"35kW",key:"Max Power"},{val:"42Nm",key:"Torque"},{val:"215kg",key:"Weight"},{val:"705mm",key:"Seat"}],
specs:[{group:"Engine",rows:[["Type","V2, 8v, liquid-cooled"],["Displacement","475.6cc"],["Max Power","35kW @ 9,000rpm"],["Max Torque","42Nm @ 7,200rpm"],["Transmission","Belt Drive"],["Fuel Use","4.5L/100km"]]},{group:"Dimensions",rows:[["Seat Height","705mm"],["Curb Weight","215kg"],["Fuel Tank","16L"],["Wheelbase","1,550mm"],["Front Tyre","150/80 R16"],["Rear Tyre","180/65 R16"]]},{group:"Chassis",rows:[["Front Susp","USD fork"],["Rear Susp","Dual hydraulic"],["Front Brake","320mm single disc"],["Rear Brake","260mm single disc"],["Display","TFT"],["Safety","ABS, TCS"],["Colours","Moonstone White / Starry Gray / Midnight Black / Starlit Blue / Adventure Red"]]}],
flashcards:[{front:"Engine type",back:"V2, 8-valve, liquid-cooled (same as NB500)"},{front:"Front suspension",back:"USD fork - sportsbike tech"},{front:"Exhaust setup",back:"Twin exhausts"},{front:"Seat height",back:"705mm - 10mm higher than NB500"},{front:"Drive type",back:"Belt drive"},{front:"Colours",back:"5 - Moonstone White, Starry Gray, Midnight Black, Starlit Blue, Adventure Red"},{front:"Curb weight",back:"215kg (same as NB500)"},{front:"Key selling point vs NB500",back:"Wider stance, twin exhausts, USD forks, classic cruiser look"}],
questions:{
easy:[{q:"What style is the Chinchilla 500?",a:"Cruiser",opts:["Bobber","Cruiser","Adventure","Naked"],fact:"City cruiser - relaxed ergonomics, classic lines."},{q:"What exhaust setup?",a:"Twin exhausts",opts:["Single torpedo","Twin exhausts","Underseat exhaust","High-mount single"],fact:"Traditional cruiser sound and look."},{q:"Best suited for?",a:"Riders wanting cruiser looks with modern components",opts:["Learners","Track enthusiasts","Riders wanting cruiser looks with modern components","Adventure tourers"],fact:"Classic cruiser feel with USD forks underneath."},{q:"Transmission?",a:"Belt Drive",opts:["Chain Drive","Belt Drive","Shaft Drive","CVT"],fact:"Same as the NB500."},{q:"How many colours?",a:"5",opts:["3","4","5","6"],fact:"Moonstone White, Starry Gray, Midnight Black, Starlit Blue, Adventure Red."}],
medium:[{q:"What type of front fork?",a:"USD fork",opts:["Telescopic fork","Multi-link fork","USD fork","Earles fork"],fact:"USD forks - sportsbike tech."},{q:"Which model shares the engine?",a:"Napoleonbob 500",opts:["Napoleonbob 250","Dark Flag 500 Commander","LFC 700","Napoleonbob 500"],fact:"Identical V-twin."},{q:"Seat height?",a:"705mm",opts:["695mm","705mm","720mm","748mm"],fact:"10mm higher than the NB500."},{q:"Tank capacity?",a:"16L",opts:["9.5L","12L","16L","20L"],fact:"Same as NB500 and Dark Flag Commander."},{q:"Rear suspension?",a:"Dual hydraulic",opts:["Mono hydraulic","Dual hydraulic","Electronic air","KYB mono"],fact:"Different from the NB500's mono setup."}],
hard:[{q:"Front suspension travel?",a:"129mm",opts:["75mm","100mm","117mm","129mm"],fact:"Most in the range."},{q:"Rear tyre size?",a:"180/65 R16",opts:["160/70 R18","180/65 R16","150/80 R16","310/35 R18"],fact:"Identical to the NB500."},{q:"Ground clearance?",a:"150mm",opts:["120mm","130mm","150mm","160mm"],fact:"Same as the NB500."},{q:"CO2 emissions?",a:"106g/km",opts:["71g/km","106g/km","135g/km","140g/km"],fact:"Between the 250 and larger models."},{q:"Wheelbase?",a:"1,550mm",opts:["1,545mm","1,550mm","1,720mm","1,856mm"],fact:"Identical to the NB500."}]}},
{id:"df500",name:"Dark Flag 500 Commander",type:"V4 Tech Cruiser",price:"$12,990",icon:"/BendaBikeIcons/DarkFlag.png",
thumb:null,
img:null,
sellingPoints:[{title:"Opening pitch",text:"V4 engine, electronic air suspension, cruise control - features you normally pay $25k+ for."},{title:"Vs competitors",text:"Nothing directly competes. Indian Scout has more power but no tech. Honda Rebel 1100 costs $8k more."},{title:"Ideal customer",text:"Experienced rider, 35+, values comfort and tech over raw performance."},{title:"Overcome objection",text:"'Heavy at 260kg' - True, but low seat and electronic suspension compensate."}],
anchors:{type:"Tech cruiser",feel:"Solid and composed — the air suspension and cruise control make long days easy",who:"Anyone who wants a tech-loaded cruiser that's genuinely comfortable on long rides"},
captions:[{label:"Engine",value:"V4 - rare under 500cc"},{label:"Suspension",value:"Electronic air - auto-adjusts"},{label:"Comfort",value:"Cruise control - only Benda with it"},{label:"Licence",value:"LAMS approved"}],
facts:[{title:"V4 engine - rare at this price",desc:"Almost no other bike under 500cc uses a V4."},{title:"Electronic air suspension",desc:"Auto-adjusts to riding conditions. Normally reserved for flagship touring bikes."},{title:"Cruise control",desc:"Only Benda model with cruise control."},{title:"Adjustable seat height",desc:"670mm to 700mm - only Benda with adjustable seat."},{title:"Heaviest 500",desc:"260kg - 45kg heavier than other 500cc models."}],
stats:[{val:"35kW",key:"Max Power"},{val:"42Nm",key:"Torque"},{val:"260kg",key:"Weight"},{val:"670-700mm",key:"Seat"}],
specs:[{group:"Engine",rows:[["Type","V4, 16v, liquid-cooled"],["Displacement","496.4cc"],["Max Power","35kW @ 9,500rpm"],["Max Torque","42Nm @ 7,300rpm"],["Transmission","Belt Drive"],["Fuel Use","5.9L/100km"]]},{group:"Dimensions",rows:[["Seat Height","670-700mm (adj)"],["Curb Weight","260kg"],["Fuel Tank","16L"],["Wheelbase","1,856mm"],["Front Tyre","130/90 R16"],["Rear Tyre","150/80 R16"]]},{group:"Chassis",rows:[["Front Susp","USD fork"],["Rear Susp","BENDA electronic air"],["Front Brake","320mm single disc"],["Rear Brake","260mm single disc"],["Comfort","Cruise control, idle shutdown"],["Display","TFT"],["Safety","ABS, TCS"],["Colours","Mystic White / Fantasy Black / Allure Red"]]}],
flashcards:[{front:"Engine type",back:"V4, 16-valve, liquid-cooled"},{front:"Rear suspension",back:"BENDA electronic air"},{front:"Unique comfort feature",back:"Cruise control (only Benda)"},{front:"Seat range",back:"670-700mm (adjustable)"},{front:"Curb weight",back:"260kg - heaviest 500"},{front:"Wheelbase",back:"1,856mm - longest in range"},{front:"Fuel consumption",back:"5.9L/100km - thirstiest"},{front:"Colours",back:"3 - Mystic White, Fantasy Black, Allure Red"}],
questions:{
easy:[{q:"Engine type of the Dark Flag 500?",a:"V4",opts:["V-Twin","Inline-4","V4","Inline-3"],fact:"A V4 at this displacement is extremely rare."},{q:"Which Benda has cruise control?",a:"Dark Flag 500 Commander",opts:["LFC 700","Napoleonbob 500","Dark Flag 500 Commander","Chinchilla 500"],fact:"Exclusive to the Dark Flag Commander."},{q:"Best suited for?",a:"Experienced riders wanting technology and comfort",opts:["New riders","Experienced riders wanting technology and comfort","Track riders","Budget commuters"],fact:"Heavy, tech-loaded, not for beginners."},{q:"How many colours?",a:"3",opts:["2","3","4","5"],fact:"Mystic White, Fantasy Black, Allure Red."},{q:"Key comfort feature?",a:"Cruise control",opts:["Heated grips","Cruise control","Adjustable windscreen","Bluetooth"],fact:"Exclusive to Dark Flag."}],
medium:[{q:"Rear suspension type?",a:"Electronic air suspension",opts:["Dual hydraulic","Mono hydraulic","Electronic air suspension","KYB coilover"],fact:"Premium tech at this price."},{q:"Curb weight?",a:"260kg",opts:["215kg","240kg","260kg","287kg"],fact:"45kg heavier than other 500s."},{q:"Seat height range?",a:"670-700mm",opts:["695mm fixed","670-700mm","700-730mm","650-680mm"],fact:"Most accessible seat for shorter riders."},{q:"Wheelbase?",a:"1,856mm",opts:["1,545mm","1,550mm","1,720mm","1,856mm"],fact:"Longest in range."},{q:"How much heavier than other 500s?",a:"45kg",opts:["25kg","33kg","45kg","60kg"],fact:"260kg vs 215kg."}],
hard:[{q:"Bore x stroke?",a:"53.5 x 55.2mm",opts:["69 x 63.6mm","53.5 x 55.4mm","67 x 48mm","53.5 x 55.2mm"],fact:"Almost identical bore to the 250 but V4."},{q:"Fuel consumption?",a:"5.9L/100km",opts:["4.5L/100km","5.8L/100km","5.9L/100km","6.5L/100km"],fact:"Thirstiest in range."},{q:"Front tyre spec?",a:"130/90 R16",opts:["130/80 R18","150/80 R16","130/90 R16","130/70 R19"],fact:"Unique spec."},{q:"Rear suspension travel?",a:"61.5mm",opts:["30mm","38mm","61.5mm","65mm"],fact:"More than bobbers."},{q:"Peak power RPM?",a:"9,500rpm",opts:["9,000rpm","9,500rpm","10,300rpm","7,300rpm"],fact:"Slightly higher than the V-twin 500s."}]}},
{id:"lfc700",name:"LFC 700",type:"Flagship",price:"$16,990",icon:"/BendaBikeIcons/LFC700.png",
thumb:null,
img:null,
sellingPoints:[{title:"Opening pitch",text:"World's first inline-4 cruiser. Widest rear tyre on any production motorcycle. The halo bike."},{title:"Vs competitors",text:"Nothing like it exists. Harley Sportster S has pedigree but no inline-4. Triumph Rocket 3 is triple the price."},{title:"Ideal customer",text:"Experienced rider who wants a talking-point machine."},{title:"Overcome objection",text:"'Never heard of Benda' - This is the bike that changes that. World firsts, Brembo, KYB - Ducati-level components."}],
anchors:{type:"Flagship power cruiser",feel:"Strong, smooth and turns heads wherever it goes",who:"Anyone who wants to own the most unique and powerful bike in the range — nothing else looks or sounds like it"},
captions:[{label:"Engine",value:"World's first inline-4 cruiser"},{label:"Rear tyre",value:"310mm - widest on any production bike"},{label:"Brakes",value:"Brembo - MotoGP-grade"},{label:"Licence",value:"Full licence required"}],
facts:[{title:"World's first inline-4 cruiser",desc:"Every other cruiser uses V-twin or V4."},{title:"Widest rear tyre",desc:"310mm claimed world record."},{title:"Brembo brakes",desc:"Gold standard - MotoGP machinery. Front and rear."},{title:"KYB suspension",desc:"Premium Japanese brand. Both ends."},{title:"Nearly double the 500s",desc:"63kW vs 35kW. Different performance league."}],
stats:[{val:"63kW",key:"Max Power"},{val:"60Nm",key:"Torque"},{val:"287kg",key:"Weight"},{val:"695mm",key:"Seat"}],
specs:[{group:"Engine",rows:[["Type","Inline-4, 16v, liquid-cooled"],["Displacement","676.9cc"],["Max Power","63kW @ 10,300rpm"],["Max Torque","60Nm @ 8,600rpm"],["Transmission","Chain Drive"],["Fuel Use","5.8L/100km"]]},{group:"Dimensions",rows:[["Seat Height","695mm"],["Curb Weight","287kg"],["Fuel Tank","17L"],["Wheelbase","1,720mm"],["Front Tyre","130/70 R19"],["Rear Tyre","310/35 R18"]]},{group:"Chassis",rows:[["Front Susp","USD fork (KYB)"],["Rear Susp","Mono hydraulic (KYB)"],["Front Brake","320mm twin disc, Brembo"],["Rear Brake","260mm single disc, Brembo"],["Display","5-inch TFT"],["Safety","Bosch ABS, TCS"],["Colours","Misty Titanium / Iron Veil / Flash Blue / Starry Black"]]}],
flashcards:[{front:"Engine type",back:"Inline-4, 16v - world first cruiser"},{front:"Displacement",back:"676.9cc"},{front:"Max power",back:"63kW @ 10,300rpm"},{front:"Rear tyre width",back:"310mm - widest production"},{front:"Brake brand",back:"Brembo - front and rear"},{front:"Suspension brand",back:"KYB - front and rear"},{front:"Curb weight",back:"287kg - heaviest"},{front:"Fuel tank",back:"17L - largest"},{front:"Transmission",back:"Chain drive"},{front:"Display",back:"5-inch TFT - largest"},{front:"Colours",back:"4 - Misty Titanium, Iron Veil, Flash Blue, Starry Black"}],
questions:{
easy:[{q:"What world first does the LFC 700 claim?",a:"First inline-4 cruiser",opts:["First turbo cruiser","First inline-4 cruiser","First liquid-cooled cruiser","First 700cc cruiser"],fact:"Genuinely unprecedented."},{q:"Brake brand?",a:"Brembo",opts:["Nissin","Tokico","Brembo","Bosch"],fact:"Gold standard."},{q:"Best suited for?",a:"Experienced riders who want to stand out",opts:["Learners","Fuel economy riders","Experienced riders who want to stand out","Budget commuters"],fact:"Not for the faint-hearted."},{q:"How many colours?",a:"4",opts:["2","3","4","5"],fact:"Misty Titanium, Iron Veil, Flash Blue, Starry Black."},{q:"What's special about the rear tyre?",a:"Widest on any production motorcycle",opts:["Widest on any production motorcycle","Run-flat","Self-healing","Dual-compound"],fact:"310mm - claimed world record."}],
medium:[{q:"Rear tyre width?",a:"310mm",opts:["200mm","240mm","280mm","310mm"],fact:"Widest production motorcycle tyre."},{q:"Suspension brand?",a:"KYB",opts:["Ohlins","WP","KYB","Sachs"],fact:"Premium Japanese brand."},{q:"Fuel tank capacity?",a:"17L",opts:["14L","16L","17L","20L"],fact:"Largest in range."},{q:"Transmission?",a:"Chain Drive",opts:["Belt Drive","Shaft Drive","Chain Drive","Direct Drive"],fact:"Same as the 250."},{q:"Power advantage over 500s?",a:"Nearly double (63kW vs 35kW)",opts:["50% more","Nearly double (63kW vs 35kW)","Triple","25% more"],fact:"80% power advantage."}],
hard:[{q:"Bore x stroke?",a:"67 x 48mm",opts:["69 x 63.6mm","53.5 x 55.4mm","67 x 48mm","67 x 55mm"],fact:"Short stroke - revs much higher."},{q:"Peak power RPM?",a:"10,300rpm",opts:["8,600rpm","9,500rpm","10,300rpm","11,000rpm"],fact:"Far higher than any other Benda."},{q:"Front tyre spec?",a:"130/70 R19",opts:["130/80 R18","150/80 R16","130/70 R19","130/90 R16"],fact:"19-inch front wheel."},{q:"Ground clearance?",a:"160mm",opts:["120mm","150mm","160mm","175mm"],fact:"Highest in the range."},{q:"Front brake disc size?",a:"320mm single disc",opts:["300mm single","310mm twin","320mm single disc","280mm twin"],fact:"Single disc — Brembo twin discs are on the LFC 700, not the Dark Flag."}]}}
];

// ── SCENARIOS ────────────────────────────────────────────────────────────────
const SCENARIOS=[
{difficulty:"easy",situation:"A 22-year-old walks in with their learner's licence. They want something that doesn't look like a 'learner bike'. Budget ~$9k.",answer:"nb250",opts:["nb250","nb500","ch500","lfc700"],reasoning:"LAMS approved, $8,990, lightest at 182kg. Entry point to the range."},
{difficulty:"easy",situation:"An experienced rider in their 40s wants a comfortable cruiser for weekend highway rides. Keeps asking about cruise control.",answer:"df500",opts:["nb500","ch500","df500","lfc700"],reasoning:"Only Benda with cruise control, electronic air suspension, adjustable seat."},
{difficulty:"easy",situation:"'I want the most powerful, most impressive Benda you have.'",answer:"lfc700",opts:["nb500","df500","ch500","lfc700"],reasoning:"63kW, 310mm tyre, Brembo, world's first inline-4 cruiser."},
{difficulty:"medium",situation:"A couple walks in. She's 162cm, worried about reaching the ground. He wants V-twin sound. They want matching bikes.",answer:"nb500",opts:["nb250","nb500","ch500","df500"],reasoning:"695mm seat, V-twin sound, 215kg manageable, matching Phantom Black (black rims) or Grey Moon (grey rims)."},
{difficulty:"medium",situation:"Rider torn between the NB500 and Chinchilla 500. Keeps saying 'I want a classic cruiser look.'",answer:"ch500",opts:["nb250","nb500","ch500","df500"],reasoning:"Same engine but classic cruiser stance - wider body, twin exhausts, USD forks."},
{difficulty:"medium",situation:"Customer sold their Honda Rebel 300. Wants bobber style with more power. Budget up to $12k.",answer:"nb500",opts:["nb250","nb500","ch500","lfc700"],reasoning:"Natural upgrade path - bobber style, 475cc V-twin, belt drive, $11,990."},
{difficulty:"hard",situation:"'What's the cheapest Benda with belt drive AND USD forks?'",answer:"ch500",opts:["nb250","nb500","ch500","df500"],reasoning:"Chinchilla 500 at $9,990 has both. NB500 has belt but telescopic. Dark Flag Commander has both but $12,990."},
{difficulty:"hard",situation:"Comparing Dark Flag 500 Commander and LFC 700. Wants most advanced technology, doesn't care about power.",answer:"df500",opts:["nb500","ch500","df500","lfc700"],reasoning:"Electronic air suspension, cruise control, adjustable seat - none of which the LFC has."},
{difficulty:"hard",situation:"Customer wants the lowest possible seat. They're 155cm. Which model?",answer:"df500",opts:["nb250","nb500","ch500","df500"],reasoning:"Dark Flag Commander adjusts to 670mm - lowest in range. NB500 695mm, Chinchilla 705mm, NB250 748mm."},
{difficulty:"hard",situation:"Which Benda gives the best fuel range per tank? Not economy - total km between fill-ups.",answer:"nb500",opts:["nb250","nb500","df500","lfc700"],reasoning:"NB500/Chinchilla: 16L at 4.5L/100km = ~355km. Beats NB250 (306km), LFC (293km), DF (271km)."},
];

// ── COMPARE ─────────────────────────────────────────────────────────────────
const COMP={
"nb250-nb500":{same:["Both bobbers with retro styling","Both ABS (Anti-lock Brakes) and TCS (Traction Control)","Both have 3-inch round TFT (digital display)"],diff:["Both LAMS approved (learner legal) for Australian riders","500 has 85% more engine displacement","500 belt drive, 250 chain","500 sits 53mm lower than the 250"],verdict:"250 for learners. 500 is the step up - more power, lower seat, proper V-twin."},
"nb500-ch500":{same:["Identical engine - 475.6cc V-twin","Same weight (215kg) and wheelbase","Both belt drive, same tyres, same tank"],diff:["NB500 is a bobber - minimalist","Chinchilla is a cruiser - wider, twin exhausts","Chinchilla uses USD (upside-down) forks vs standard telescopic","Chinchilla sits 10mm higher than the NB500"],verdict:"Same under the skin. Choice is purely style. Bobber or cruiser?"},
"ch500-df500":{same:["Both cruisers","Both belt drive","Both 16L tanks"],diff:["Dark Flag Commander has a V4 (four-cylinder) engine, Chinchilla has a V-twin (two-cylinder)","Dark Flag Commander has electronic air suspension","Dark Flag Commander has cruise control","Dark Flag Commander is 45kg heavier","Dark Flag Commander has an adjustable seat"],verdict:"Chinchilla is simpler and lighter. Dark Flag is loaded with touring tech."},
"df500-lfc700":{same:["Both for experienced riders","Both have premium suspension","Both ABS (Anti-lock Brakes) and TCS (Traction Control)"],diff:["LFC makes 63kW - nearly double the Dark Flag","LFC has an inline-4 (four cylinders in a row) vs Dark Flag Commander V4 (four cylinders in a V)","LFC has Brembo brakes (MotoGP grade)","LFC is heavier (287kg vs 260kg)","Dark Flag has cruise control and an adjustable seat"],verdict:"Dark Flag Commander for comfort and tech. LFC for power and presence."},
"nb250-lfc700":{same:["Both chain drive","Both ABS (Anti-lock Brakes) and TCS (Traction Control)"],diff:["LFC makes 63kW, 250 makes 19kW","LFC weighs 287kg, 250 weighs 182kg","250 is LAMS approved (learner legal), LFC 700 is not","LFC has Brembo brakes and KYB (premium Japanese) suspension","LFC has 5-inch TFT (digital display), 250 has 3-inch"],verdict:"Opposite ends of the range. Nothing in common except chain drive."},
"nb250-df500":{same:["Both ABS (Anti-lock Brakes) and TCS (Traction Control)"],diff:["Dark Flag Commander has a V4 (four-cylinder) engine, 250 has a V-twin (two-cylinder)","Dark Flag Commander is 78kg heavier","Dark Flag Commander has air suspension and cruise","250 LAMS approved. Dark Flag is also LAMS approved. Only LFC 700 is not."],verdict:"250 for new riders. Dark Flag for experienced riders wanting touring comfort."},
"nb500-df500":{same:["Both belt drive","Both ABS (Anti-lock Brakes) and TCS (Traction Control)","Both 16L tanks"],diff:["Dark Flag Commander has a V4 (four-cylinder) engine vs V-twin (two-cylinder)","Dark Flag Commander is 45kg heavier","Dark Flag Commander has air suspension and cruise","Dark Flag Commander has an adjustable seat"],verdict:"NB500 is raw and stylish. Dark Flag is feature-loaded touring."},
"nb250-ch500":{same:["Both ABS (Anti-lock Brakes) and TCS (Traction Control)"],diff:["Chinchilla has a 475cc engine, 250 has 249cc","Chinchilla weighs 215kg, 250 weighs 182kg","Both LAMS approved (learner legal) for Australian riders","Chinchilla has USD (upside-down) forks and belt drive","Chinchilla 16L tank vs 9.5L"],verdict:"250 for learners. Chinchilla is the step up - more engine, more range, better components."},
"nb500-lfc700":{same:["Both ABS (Anti-lock Brakes) and TCS (Traction Control)"],diff:["LFC makes 63kW vs 35kW on the 500s","LFC has an inline-4 (four cylinders in a row) vs V-twin (two-cylinder)","LFC uses chain drive, 500 uses belt drive","LFC has Brembo brakes and KYB (premium Japanese) suspension","LFC weighs 287kg, NB500 weighs 215kg"],verdict:"NB500 is the accessible mid-range. LFC is the performance flagship."},
"ch500-lfc700":{same:["Both cruiser-style","Both ABS (Anti-lock Brakes) and TCS (Traction Control)"],diff:["LFC makes 63kW vs 35kW on the 500s","LFC has a 310mm rear tyre (widest production)","LFC has Brembo brakes (MotoGP grade)","LFC uses chain drive, Chinchilla uses belt drive","LFC 287kg, Chinchilla 215kg"],verdict:"Chinchilla for attainable cruiser vibes. LFC for the bold statement."},
};

const COMPQ=[
{q:"Most beginner-friendly Benda?",a:"Napoleonbob 250",opts:["Napoleonbob 250","Napoleonbob 500","Dark Flag 500 Commander","LFC 700"],fact:"LAMS approved, lightest at 182kg.",bike:"Comparison",difficulty:"medium"},
{q:"Best 500cc for touring?",a:"Dark Flag 500 Commander",opts:["Napoleonbob 500","Chinchilla 500","Dark Flag 500 Commander","LFC 700"],fact:"Cruise control, air suspension, adjustable seat.",bike:"Comparison",difficulty:"medium"},
{q:"NB500 and Chinchilla share an engine. Main difference?",a:"Body style - bobber vs cruiser",opts:["Engine size","Body style - bobber vs cruiser","Transmission","Suspension brand"],fact:"One bobber, one cruiser.",bike:"Comparison",difficulty:"medium"},
{q:"Most powerful Benda?",a:"LFC 700",opts:["Dark Flag 500 Commander","Napoleonbob 500","Chinchilla 500","LFC 700"],fact:"63kW - nearly double the 500s.",bike:"Comparison",difficulty:"medium"},
{q:"Lowest seat in the range?",a:"Dark Flag 500 Commander",opts:["Napoleonbob 500","Dark Flag 500 Commander","LFC 700","Chinchilla 500"],fact:"Adjustable down to 670mm.",bike:"Comparison",difficulty:"medium"},
{q:"Which two use chain drive?",a:"Napoleonbob 250 and LFC 700",opts:["Napoleonbob 250 and LFC 700","NB500 and Chinchilla","Dark Flag and LFC","All belt drive"],fact:"250 and LFC use chain. 500s all belt.",bike:"Comparison",difficulty:"medium"},
];

function compKey(a,b){const ps=[["nb250","nb500"],["nb500","ch500"],["ch500","df500"],["df500","lfc700"],["nb250","lfc700"],["nb250","df500"],["nb500","df500"],["nb250","ch500"],["nb500","lfc700"],["ch500","lfc700"]];const m=ps.find(p=>(p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a));return m?m.join("-"):null;}

// ── CSS ─────────────────────────────────────────────────────────────────────
const CSS=`@keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes fi{from{opacity:0}to{opacity:1}} @keyframes si{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}} @keyframes pg{from{width:0}} @keyframes cp{0%{transform:scale(1)}40%{transform:scale(1.012)}100%{transform:scale(1)}} @keyframes ws{0%,100%{transform:translateX(0)}25%,75%{transform:translateX(-3px)}50%{transform:translateX(3px)}} @keyframes tr{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}} @keyframes fc{from{transform:rotateX(80deg);opacity:0}to{transform:rotateX(0);opacity:1}} .au{animation:fu .38s ease both}.ai{animation:fi .3s ease both}.as{animation:si .35s ease both} .ac{animation:cp .35s ease}.aw{animation:ws .35s ease}.at{animation:tr .5s cubic-bezier(.34,1.56,.64,1) both} .af{animation:fc .25s ease both} .tp{transition:all .15s ease;cursor:pointer}.tp:active{transform:scale(.97);opacity:.85} select{-webkit-appearance:none;appearance:none} *{-webkit-tap-highlight-color:transparent;box-sizing:border-box} body{margin:0;padding:0}::-webkit-scrollbar{width:0}`;

// ── HELPERS ─────────────────────────────────────────────────────────────────
function A({children,d=0,t="au",s={}}){return <div className={t} style={{animationDelay:d+"ms",...s}}>{children}</div>}

function Ring({pct,sz=44,sw=3,c}){
  const cl=c||(pct===100?C.accent:pct>0?C.accent:C.t4);
  const r=(sz-sw)/2;
  const ci=2*Math.PI*r;
  const o=ci-(pct/100)*ci;
  return <svg width={sz} height={sz} style={{transform:"rotate(-90deg)",flexShrink:0}}>
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={C.border} strokeWidth={sw}/>
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={cl} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={o} strokeLinecap="round" style={{transition:"stroke-dashoffset .8s ease"}}/>
  </svg>
}

function bm(p,id){const bq=p.bikeQuiz[id];if(!bq)return 0;let t=0,m=0;["easy","medium","hard"].forEach(d=>{if(bq[d]){t+=bq[d].best;m+=bq[d].total}});return m>0?Math.round(t/m*100):0}
function om(p){let s=0;BIKES.forEach(b=>{s+=bm(p,b.id)});return Math.round(s/BIKES.length)}
function bs(p,id){const bq=p.bikeQuiz[id];if(!bq)return null;for(let i=2;i>=0;i--){const d=["easy","medium","hard"][i];if(bq[d]&&bq[d].best===bq[d].total)return`${d} done`;if(bq[d])return`${d} started`}return null}
function nb(id){const i=BIKES.findIndex(b=>b.id===id);return i<BIKES.length-1?BIKES[i+1]:null}

// ── GLOSSARY ────────────────────────────────────────────────────────────────
const GLOSSARY = [
  {
    category: "Bike Styles",
    terms: [
      { term: "Bobber", def: "A stripped-back, minimalist motorcycle style. Everything non-essential is removed — no front fender, short rear, solo seat. Low and mean looking. The Napoleonbob range is Benda's bobber lineup." },
      { term: "Cruiser", def: "A relaxed, low-slung style built for comfort over long distances. Feet-forward riding position, wide handlebars, lower seat. The Chinchilla 500 and Dark Flag 500 Commander are cruisers." },
      { term: "Flagship", def: "The top of the range — the most premium, most powerful, most expensive model. The LFC 700 is Benda's flagship." },
      { term: "LAMS", def: "Learner Approved Motorcycle Scheme. In most Australian states, new riders must start on a LAMS-approved bike. The NB250, NB500, Chinchilla 500 and Dark Flag 500 Commander are all LAMS approved. Only the LFC 700 is not." },
    ]
  },
  {
    category: "Engine Terms",
    terms: [
      { term: "Displacement (cc)", def: "The engine size — how much air and fuel the cylinders move per cycle. Bigger cc generally means more power. The 250 has 249cc, the 500s have ~475-496cc, the LFC 700 has 676.9cc." },
      { term: "V-Twin", def: "An engine with 2 cylinders arranged in a V shape. Classic motorcycle sound — deep, rhythmic rumble. Used in the Napoleonbob 500, Chinchilla 500, and Dark Flag 500 Commander (which uses a V4)." },
      { term: "V4", def: "Four cylinders in a V arrangement. Smoother and more powerful than a V-twin. Very rare in cruisers — the Dark Flag 500 Commander is one of the only sub-500cc bikes in the world to use one." },
      { term: "Inline-4", def: "Four cylinders in a straight line. Produces smooth, high-revving power. The LFC 700 is the world's first inline-4 cruiser — every other cruiser uses a V-twin or V4." },
      { term: "kW (Kilowatts)", def: "How power is measured in Australia. The 500cc Bendas make 35kW. The LFC 700 makes 63kW — nearly double. For reference, 35kW is roughly 47 horsepower." },
      { term: "Nm (Newton metres)", def: "Torque — the twisting force that makes a bike accelerate. More Nm means stronger pull from lower revs. The 500s make 42Nm, the LFC 700 makes 60Nm." },
      { term: "Liquid-cooled", def: "The engine uses coolant (like a car) to manage temperature. More efficient and reliable than air-cooled engines. All Benda models are liquid-cooled." },
    ]
  },
  {
    category: "Transmission & Drive",
    terms: [
      { term: "Chain Drive", def: "Power from the engine goes to the rear wheel via a metal chain. Needs regular lubing and cleaning. Used on the Napoleonbob 250 and LFC 700." },
      { term: "Belt Drive", def: "Uses a rubber belt instead of a chain. Quieter, cleaner, no lubing required — just replace it every few years. Used on the Napoleonbob 500, Chinchilla 500, and Dark Flag 500 Commander." },
      { term: "Slipper Clutch", def: "A safety feature that prevents the rear wheel from locking up when you downshift aggressively. Makes the bike easier and safer to ride. All Benda models have one." },
    ]
  },
  {
    category: "Suspension & Brakes",
    terms: [
      { term: "Telescopic Fork", def: "The standard front suspension on most bikes — two tubes that slide into each other like a telescope. Simple and effective." },
      { term: "USD Fork (Upside-Down)", def: "The larger tube is at the top, smaller at the bottom — opposite to standard. Stiffer and more precise under braking. Sportsbike tech. The Chinchilla 500, Dark Flag 500 Commander, and LFC 700 all have USD forks." },
      { term: "Multi-link Fork", def: "A unique suspension design on the Napoleonbob 250 that uses linkages instead of standard tubes. Reduces front-end dive under braking and absorbs bumps more effectively. Rare on a small bike." },
      { term: "ABS", def: "Anti-lock Braking System. Prevents the wheels from locking up under hard braking, so the bike stays controllable. Standard on all Benda models." },
      { term: "TCS (Traction Control)", def: "Detects when the rear wheel is spinning and reduces power to prevent a slide. Helpful in wet conditions or when accelerating hard. Standard on all Benda models." },
      { term: "Electronic Air Suspension", def: "The suspension automatically adjusts its stiffness based on riding conditions. Premium feature usually found on $25,000+ touring bikes. Exclusive to the Dark Flag 500 in the Benda range." },
      { term: "Brembo", def: "An Italian brake company considered the gold standard in motorcycle braking — used on MotoGP bikes and high-end superbikes. The LFC 700 uses Brembo brakes front and rear." },
      { term: "KYB", def: "Kayaba — a premium Japanese suspension brand used on top-tier motorcycles. The LFC 700 has KYB suspension front and rear." },
    ]
  },
  {
    category: "Other Terms",
    terms: [
      { term: "Seat Height", def: "The height of the seat from the ground. Lower is generally more accessible for shorter riders. The Dark Flag 500 has the lowest adjustable seat at 670mm. The Napoleonbob 250 has the tallest at 748mm." },
      { term: "Curb Weight", def: "How heavy the bike is fully ready to ride (with fluids, no rider). Heavier bikes feel more planted but can be harder to manoeuvre at low speeds. Ranges from 182kg (NB250) to 287kg (LFC 700)." },
      { term: "Wheelbase", def: "The distance between the front and rear axles. Longer wheelbase means more stability at speed but harder to turn tightly. The Dark Flag 500 has the longest at 1,856mm." },
      { term: "TFT Display", def: "Thin Film Transistor — a type of colour digital screen. Bright and readable in all light conditions. All Benda models have TFT displays. The LFC 700 has the largest at 5 inches." },
      { term: "Ride Away Price", def: "The total you actually pay to get on the road — includes the bike price plus registration, stamp duty, CTP insurance, and dealer delivery. Always higher than the advertised price." },
    ]
  },
];

// ── NAV ICONS ───────────────────────────────────────────────────────────────
const Icons={
  range:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  train:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  compare:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  progress:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>,
  glossary:()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
};

// ── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
function TabBar({active,onChange}){
  const tabs=[{id:"range",label:"Range",icon:Icons.range},{id:"train",label:"Train",icon:Icons.train},{id:"compare",label:"Compare",icon:Icons.compare},{id:"progress",label:"Progress",icon:Icons.progress}];
  return <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.s1,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom)"}}>
    {tabs.map(t=><button key={t.id} className="tp" onClick={()=>onChange(t.id)} style={{flex:1,padding:"10px 0 8px",background:"none",border:"none",color:active===t.id?C.accent:C.t2,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",transition:"color .2s"}}>
      <t.icon/><span style={{fontSize:10,letterSpacing:1,fontWeight:active===t.id?600:400,fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase"}}>{t.label}</span>
    </button>)}
  </div>;
}

// ── HEADER ───────────────────────────────────────────────────────────────────
function Hdr({title,onBack,right}){
  return <div style={{background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"16px 20px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100}}>
    {onBack&&<button className="tp" style={{background:"none",border:"none",color:C.t3,fontSize:22,cursor:"pointer",padding:"0 8px 0 0",lineHeight:1}} onClick={onBack}>←</button>}
    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:17,letterSpacing:2,textTransform:"uppercase",flex:1}}>{title}</div>
    {right}
  </div>
}

const sec={fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.t3,marginBottom:14,fontWeight:600};
const bd={padding:"24px 20px"};
const BIKE_COLOURS={nb250:"#a855f7",nb500:"#a855f7",ch500:"#a855f7",df500:"#a855f7",lfc700:"#a855f7"};
const crd={background:C.s1,border:`1px solid ${C.border}`,borderRadius:6};
const btnA={width:"100%",padding:16,background:C.accent,border:"none",borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase",color:C.bg,cursor:"pointer"};
const btnG={...btnA,background:"transparent",border:`1px solid ${C.border}`,color:C.t3};

// ── RANGE TAB ───────────────────────────────────────────────────────────────
function RangeTab({onBike,progress:pr}){
  return <div style={{paddingBottom:80,background:"#000000",minHeight:"100vh"}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <A><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAABkCAYAAABzXA4QAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAllElEQVR4nO1deXQVRdb/db8lwRBABYKAxoUMKOAMIQiS4XPhuKOgyABJIBrMiEhABcYVEUVHB1AmoIBCwpaImVEQwogaEWWboFEJDpsiRBYJBgjZSPp1v/r+gFvp16/fy9vjUr9z7knS6a66td26deveKgkAQzPDYrFA0zQkJyfj0ksvRV5eHiwWCwBA0zTcdtttkGUZ69at4+8KCAhEHnJzMyBJEgAgOjoaixYtQrt27VyeA0BUVBQWLFiAtm3bwul0QpabnW0Bgd8lmnXkSZIEq9UKTdPw2muvoVu3bqisrHR7r6amBp07d8bSpUshSRJkWXYRKAICApFBswoMq9UKh8OBMWPGYOzYsXA6nbDZbKbvMcZw++23Y9q0aVBVlS9ZBAQEIodmExiyLMPhcKB3796YN28eHA6H16WGJElQFAXPPvssBg0aBFVVYbfbI8ixgIBAswgMWk60bt0aeXl5iI6O9smQKUkSnE4ncnNzcfnll0NRFKFpCAhEEM0iMCwWC5xOJxYvXoyuXbtCVVVYrVafv2vbti3y8vK4hiGMoAICkUHER5rVaoWqqpgyZQqGDh0Kh8Phk7Awft+vXz/Mnj0bmqYJLUNAIEKIqMCgwX7jjTfi5Zdf9lmz8JTO+PHjMWrUKL+FjoCAQGCImMCQZRlOpxOdOnXCsmXLAJy1SQS6PUrLk/nz56Nnz55QVVUsTQQEwoyIjDC938TSpUvRqVMnj0sJxtwdT/XPGGNgjEGSJDDGEBMTg7fffhstW7bkeQkICIQHERld5Jz10ksvYeDAgVAUxXQJwRgzfU5+GEZhYrFY4HA40L17dyxcuBBOp1PYMwQEwgwWTrJarQwAu+eeexhjjDkcDuZ0OpnT6WSMMf67oiiMMcYGDx7MADCLxcIsFgsDwJKSkhhjjKmq6vItY4xpmsYaGhoYY4xNmDCBAWA2my2sZRIk6HdM4UucBnxCQgI7efIk0zTNZbATSFisWbOG2Ww2/p0+jddff50LHCOcTidzOBxMURT25z//mQGNgkqQIEEhpfAkLEkSs1gsLDo6mn3xxRdcQzCCnv3www+sbdu2DICLwJAkicmyzKKiolhxcbFHoUHPDh48yNq1a8e/+wVUsCBBvyUKT8I0wy9YsIBrEbScINI0jSmKwhoaGlj//v0Z4CosiGjgX3HFFayiooKpquqyPCEioVFYWMgkSWI2m00IDUGCQkuhT5SExZgxYzwKC6fTyW0PDz/8MAO82x7of3fddZebLcQszenTpzeZpiBBgvym0CZIGkLv3r1ZXV0dU1WV2y70RHaLZcuWMcA3mwO9M2PGDK+CiDSNO+64w4UnQYIEBU2hS0yWZSbLMmvdujXbvXu3x0FNA7q0tJS1bNmSybLMJElqMn1JkpjVamWyLLOPPvrIo6ZBAur48eMsPj6e8/YLqGxBgn7tFJqEJElidrudAWAFBQVedzRUVWVVVVWsR48eDPBPAyDh0qFDB3bo0CHG2NmtVX36eqG0ZcsWZrfbmdVq9UkoCRIkyCuFJiFaLkyaNIlrFp62PxljLDU1lQFnbQz+DmQSMNdff72LAVQvMPT2jLlz57rwKEiQoIAp+ETIsGg2gPUgITJnzhyX7wIhGvyPPfaYRwGlf56WlhZ0noIECQoyAVoidOzYkR06dIjbEIwgf4tNmzYxm83GbRHB5E1Cw9sSSNO0oJZAggQJcqHAP9YbIYuKilwEg3HQOp1OVl5eHlIjJDmHtW7dmu3Zs8dj/vSstLSUxcTEMIvFIoygggQFRoF/TDP8Sy+95HGGJ7uF0+lkt99+u8t3oSBKKzExkdXV1Xl0Pyfeli9fzgCxNBEkKEAK7EMaqIMHD+a2Am8D9dlnn3X5LpREad5///2MMcYaGhrceNH7fmRlZYWNF0GCfuPk/0ekzickJLATJ04wTdNMtQtaCqxbt44BCOvWJmkMeld0M21HVVWmKIpXV3RBggR5JP8+ILtBixYteDCYN7vBgQMHWNu2bcMeDKYPUvMW7EYG2QMHDoggNUGC/Cf/PjDO5OTrYJzJNU1j9fX1LDk5mQGRmcnNNB+zHRt9kBoQXs1HkKDfGPn2IkV/Ao22AkVRvA7IZ555hgGRtRUQj6mpqR61DD2PZFsRRlBBgnwi316kQd+rVy8eVGZm5KRnR44cYa1atYr4FiYtMWRZZt98843LMsTIJxlqKUhNGEEFCfJOPp3pSTeOtW7dGvn5+WjRogU/iNcIusHss88+Q1VVFf82UmCM8RPK169fDwA8f6Y7F1R/Ynlubi4uvfTSgK89EBD4vcAngUFH+r/11lvo1q0bHA6Hy2G7zOSA3j179jTbDevEy//+9z8AcOOD+LVYLNA0De3atcOKFStgt9uDuvpAQOC3jiYFhs1mg6qqmDRpEoYNG2Z6aZDZIKPj/ptj8BE/nvjU80s3yCcnJ2PmzJm8fEJoCAi4w6v+Tcf4X3/99fjHP/7BVXZvg4n+16tXL1PNI1JgjCExMZH/bgbilYTihAkTsH37duTl5fHb1SKFSAooSZIgyzIYY3A6nU3WT6Sh58cTD6FY6npK25f8QwG6r8fpdPpdFovFwr8N9RgjvjRNM78nyIz0504cPnzYo/HQzJjodDpZTU0NS0hI4Gl5yifURHy3adOGHTlyxO1aAm98a5rGqqurWffu3Rnw+3Hq+qWV09ct7nD79USyzFar1ad2kGU5ou1l3AiQzv3iAlLnNU3D+vXrcdNNN5kaBPUGRD3oVrONGzfipptuanImCyVIM1ixYgVSU1MD4nvnzp3o378/6urqwqol0e1t3bp1Q05OTkTqhzGG2tpa7N+/H0VFRSgsLISiKNxQTDx17NgRK1asQHR0dMT4slgs2LNnDx544AFomobU1FRMmDABDQ0N3GbmdDphtVqxYMECLF261G9NUF++vLw8REVF8XJrmoaoqCgsWLAAubm5kGUZixYtwlVXXQWHwxHSW/UURcGxY8ewfft2rFu3Dvv27QPQeKWoGfT/S05OxuDBg9GzZ0+0atXKrYy+QP8etbHT6cRPP/2ErVu34r333kNZWRmXBfSOm2QlqfLiiy8yxjzHZpDG4S2cfdasWQyIjJ8D5TFx4kTGmHl8C/3tSVsivilILZxbrTRD9unTp0kNKFwoLS1lN9xwAwPgsgV++eWXNws/u3bt4jw89dRTHt/TNI3deeedfvctSrtLly4e06YDpAGwb7/9NhzFdEFtbS2bP38+u+CCC3g7eOK7bdu2/DiHcOPkyZPs0Ucf5fmf07rMB92QIUMYY40OTsZzM2lg0f/1B/3S+xTPMWLEiLAPPuL7//7v/5jD4WAOh8Pt8GESEsS78aoCgjFILVzCjjpBr169+MFD3ojKRWR83tTfelIUhZdTVVU2dOhQlza67LLLWE1NDY+98Sdtf/nT57F9+3a+HJg8eTJTVZXV19fz9yhuiZaP/sYE6QVibW0tz9vhcPB8nnrqKf5+cXGxyzv+1nNT3+hjnnbv3s2uvPJKt/KQb1FcXBz3LdKnE8p+oSfC7Nmz9ePAXPoaXavNTvxet24dS0pKYhUVFVyIGK8x1DQt7IfX6O0tZWVlvEKNwkJVVdbQ0MAGDBjAFi5cyIWD2fWL9C51yHAIO6rvxMREnyS+UWgbnzf1txlR+aurq1nXrl35YL3ssstYXV0dr49A0vaVP30eX375JedhypQpvC2NIKFfXl7OunXr5nMb6QXGmTNneN764yOffvpp/j7FJRknxFDWhaZpnJeDBw+yTp06cedDEhaSJLH169czxhg7c+aM13x9rfem+NVfQ5qenk510ijFLBYLi4qKYtu3b3dpFLOG+vHHH1mnTp0YAHbnnXfyhjV2BP3hNbGxsSH3/CS+LRaL10N8SMiNHTuWAWAtW7ZkJSUlHt83BqmFw9hE9dC7d2+3/PV8+KJ9+EPGNqK6yc/P57zpBYbZ4A41T6RhFBcX+yQw9O22b98+dtFFF7nUqT8Cg8pnJjD0Gkak2mH16tWcVxKCI0eOdHmHQBN1qMi4VKdJ/+jRo6x9+/aNAsMYVObrHaYtWrRgANj06dM9fkeFXLlyZchna0pr1qxZphWq5yk3N5cB4Keb/+EPf2AnTpzweKwgpRWuILWmBIYvuzuBwmymOX36NOvYsSMfUJ4ERjixe/dunwUGY43Bj8XFxSw2NrbJ6GN/BcauXbvCWVy3uiUe9JqtLMts69atLlpQJHkiwfz4448zK9DovHTffffhwQcf9Liz4HA4YLfbkZWVhc2bN8NqtaK+vh5WqxXTpk1Dnz59cNttt/HdBgL5OQwfPhwlJSWYOXMm7HY7FEVBMCAL+ciRIzFp0iRTvunZ119/jXHjxnHfEqvVin379iEjIwOrV6+GqqpuDmjE9x133IGpU6fihRdegN1uh8PhCPvOAVnud+7ciSNHjsBqtQadJzu3E9G3b1/ExMTA6XS6+AK0atUKPXr0wNGjR00t7ZT/vn37cODAgZDwRHA6nbBYLNi7dy9kWeYhBk3BbrdDVVVcc801eOedd3DXXXfxsIVAeaOyy7KMDRs24MiRI9A0LWS7JE6nE7GxsejTpw9sNhtvBz2GDx+OrVu3QlVVXH755UhMTIQkSXxcUdkaGhqwdevWoHdxJEmCqqro0KED/vSnP7n9jzGGIUOGAKRm9+rVixuBzGYUmm0XL17sopEAjTaE9u3bcxuCUc2n9bKqquzmm28OWtMgvnv27MmqqqpMj+YjdaqyspIbk/R5kqbhTTvSr/NDHaTmTcMgXoYPHx4yjYYoLS3NrY2o3Wmt2qVLFzcNg3giy3m4iPqWNw3DqBGSpqG/Sc9MG/RHw6D+ES4aMGAAO3nypEvfpTbZvHkzf++OO+5wKzPx+thjj4WUJ4vFwjZv3uzCC/F26tSps8FnFFR23nnnNe61nvM/YIxB0zTYbDaUlJRg/PjxkGXZZe+bJOTx48eRlpYGRVFcfC8oTVmWIcsyli9fjvj4eKiqGpBUJInXqlUrrFy5ErGxsW5718S3LMv461//it27d7vt2ZOmMW3aNKxdu5ZrWvo0iG/gbJBafHx8SGcbI/T1BQDnnXcerFYroqOjYbVagyK73Q6r1YqNGzdy3wanzj/Gm/eknq+oqKiQ8aQni8XCPVDN8jb2JfINYIzBZrNBURSMGjUKs2bNgqqqsNlsPvkkGNMmOJ1O2Gw22O12N7LZbLw/B0IWiwWbNm1CUVGRS1kIbdu2hd1uBwBccMEFnB/ik/rfxo0bIUlS0PzIsoyoqChomobNmzfz/KhfAGflhKxpGl599VV069YNiqK4LCXoI0mSUFlZidTUVJw5c4ZXsh6apsFut2PTpk2YMmUKd/bQgyqmffv2ePvtt3mF+Ot+Sx198eLFuOqqq0z5pg4ze/ZsFBQU8OWFHiTUZFlGRkYGDh48CKvV6jZoiO927dohJycnoi7T9fX1UFWV/wyGFEXh9WKxWFzakDrgkSNHmuSJ0gkFT3rSNK1JF2lJklBTU4Ndu3bxfkCwWq1QFAWTJk3C3/72NyiKEnT0scPhgKIobuRwOLhLdyBE7vmnTp0C4D6e9MsPs/5Gz2jypLoLljwt5eiZtX///khPT+dahFlkp8ViwdSpU7F3717YbDaXWdhYuVarFdnZ2ejbty9SUlKgKAoXDECj3eHaa6/FnDlzMG7cOK9pGkG2jyeeeAL33nsvt6voQWX57LPP8Pjjj8NisXj0BnSe8xysqKhAVlYW1q5da+oJSnzfeOONGDx4MFatWhWWeBN9RwCAiy66CPHx8aYCz990afZ+5JFHuECnQSdJEioqKrBz504AjbOL8XsAaNeuXUh40kOWZZSXl6O2ttatD5JtSa9dpKSkYP78+bj22mvhcDh437XZbNA0Da+88gqOHz+OJUuWNGkvMwYk0k/GGNLS0tChQweXwSTLMsrKyvCvf/0rKFsJ2W3MeNBrsHq+mpqsyCYVCPTahj5fl9+XLFnisl4xWyfu37+fRUdH+7QlStucLVu2ZKWlpaZpk12AMcbGjBnD15ze0gUa7Ra33HIL0zTN1JOT1oM//fQT69y5s89ndlLaxvWbHrRtvHbtWpdvAiVvNgzaLmtoaGBnzpwJCdXV1bH6+nqXemKs0T41b948zpunbVWn8+wVlHV1dSHjq6amhjU0NHDPzejoaFMbht4/oHPnzqxDhw7s4MGDbu1FuwmqqrJBgwa52EV8sWHQSXGyLPP7bozYsmWLS3r+EvX3t956yyVvGnPfffcd34FMT0/32Cd79+4dFB9m9Pzzz7vwpIe1X79+XIIww6E4pK6vXbuW74Y0Zb1m56RtTU0N0tLSsHXrVkRHR3MJTXnR7Dxv3jzs2LEDX375JT+fwgz0fnx8PJYtW8ZVNv1sAJzVLqxWK9LT03H48GGftQBK591330VycrKL9CeQ9E5MTERMTAyfDVmAM4wR+vqnGd3IQyhA7coY40uUw4cP44UXXjCNZTDyZdToggWl72n5wAz2BU3TEBsbi927d2Pw4MHYsGEDzj//fK4xUd1JkoSVK1di4MCBKC4u5tqHNz70cDqdqKys5MslWpparVZUVlaGpOxN8eDtHaMGIEkSevbsiQsvvBCapgW01FdVFV26dPGYl/Xiiy9uMqHdu3f7lTlVamlpKR566CEsW7aMH7pjVPuioqKQn5+Pvn374vTp06YDkJ7Z7Xbk5eWhffv2vHPo36XO//TTT+Ojjz7ya8lA6ezduxeAq0qo5wM4a4SKi4vDDz/8EFKBYQa9oDXC2Jhm9WYGKhs7p15///33uO2221BeXm5qw/GWtz5Ps+WsGTwF/flTjw6HA5IkYceOHbj33nvxwQcfcN5JrdY0DTExMXj//fdx3XXX8SW1L+UjWCwWfqQDCSEy0IYT3pYfRgEONNrZ5syZgxtuuCHo/Nk5U4T+bwCQ9ZZQ6vzGhgtkR4D8H5YvX4558+a5SHfKgyRaQkICcnNz+axuzI8qY/bs2UhOTnY78Yvys9lsWLNmDV566aWA7Qv69ZtZXej5DzUoXSK93YB4MptVmiI9jMKFBkDnzp098uWtLjzlo/8fDWBP/OvzMNaHkW8jT1FRUfj0008xevRobo+h3QTqX3FxcVi7di06dOjABY0xH1/a0xcbQjih7xee+GhoaIDT6QzYKGs0PBvzko1WcTNm/vjHPwY0SGjmmDRpEv773/9y6a7vZGTwHDx4MLKysty2WmmZcvfdd2P8+PFuzlnUcWw2G/bv34+MjAw367kvoDL36NEDAFz4NOLkyZMoLy8H4JsK6Q8PxgFIjahpmstugp78eU5/64XRpZdeiqKiIn6MgTfejDz5Qr7wZ5avcRY1PgcaDe0FBQWYMGGC27KZ/k5ISMD777+P2NhYt9nTm9AzyzOcaIoHX/gMdrvXm3CXt23bBsDdKg6AV+qgQYN4RfujbZCQURQFKSkpOHHihOkamdTRp59+Gm3atOEdWpIkvosxbdo0U+lKs0lDQwNSU1Nx4sQJ/p2v0Fu/hw0bBsBcq6K98q+//hp1dXV+q9H+gtTrUPo6kDpN9SZJEhfsixcvxvnnn8/rxAxUT6Hkh/w6fLWNGCcv0i7nzp2LF1980W33hjSNa665BgUFBVxjbU5toSkEqs2Eyz+IYH3zzTcxevRot39QZ1JVFZ06dcKECRN4Y/gzGMn55cCBA0hPT8eaNWvcXGFJiMTFxaFv37748MMP+WB0Op3o2rUrevbs6TIz6I2cNpsN48eP54YtX7doCdSh0tLSkJiY6ObabqyTnJwcAOGddcjIVlBQgJKSEr6k87REMoOZTcPhcOCqq65CRkYGLw+5y1988cUYOXIk3njjDdPyk9ZVWFiIDRs2wG63u6mvZmhqRqR23bFjh9fyeIOqqrBYLHjmmWfQoUMHjBkzxkUbpSXqrbfeijfeeINPQL7mF86JQZ9HsPnotb9Aodc+TfvbokWLGGOe7yPVNI3V1dWxxMTEgLYTJd0lSP/85z8ZY+5bRLRlmZGRwbedKJ+bbrqJMebuDkxpvPfee/wbyc/gMNqOio+PZ+Xl5U3elvbxxx+7hB77k5envJOSknhdE6gt6JyKUNPnn3/uUqdU/2vWrGEA2BVXXOHRNXzChAlh4YmIthw9basqisK6dOniUofUzyhyec2aNS7fGtuxoKCAVVRUmJaPtlUB1/B2fZ9bv369W/7+llGSJPbmm2+65K13ZYiJiWEA2OjRo13y1vOclJTEgMZt402bNrn13VDCSjaG/v3748orr3SbXWkGaNGiBfLz89GvXz9UVVV53QI1gunctF9++WXcd999aNWqlds2Ls12RniySJOL+owZM7wa5jyB1D4yzup3X/SgZ8ePH8cDDzzA+fYnL39B9dKmTRvugh2skxRjjHtD7tu3DwMGDHDZVZAkCZdddhkAeG3b1q1bh4wnPXzx9PQGan/GGEaOHImioiL069fPpU1pOTZs2DCusQWiKVK/MVti+8InabXelhD+9C/S/p588km0b9/e6+6aJ8iyDEVRkJ6ejqFDh5qOBSsAnD59GikpKdiyZQv3mTAuGVRVRdeuXbF48WIMHTq0yT1tswJZLBb89NNP+OKLLzBw4EBTXwd/0pNlGd999x1KS0u5UPIV1OAOhwOvvfYaBgwY4DFKlxpu9OjRKCsr80tYBovTp0+jvr4+ZOk1NDQAAC655BIA7suF8847DwC8DqSampqQ8mSEzWYL+FvqF7W1tRgyZAg+++wzdO3a1aXzk90mGK9Ih8MRlLCkpXS/fv1MbYO1tbW8rfwBxYEEg6SkJAwdOtRUYFmpIr/55huMHz8eOTk5UBTFzU2cZpN77rkHU6ZMwcyZM/2eYWhG//HHHwEEty6kb48cOcIltb/76w6HAyNGjMAjjzzi5sJOIJ+SadOm4cMPPwyLO7gZSIMZOHAg7HZ7QDs/ZmmSTei6665z2y0AznZUff7G7wFwt/9Q8EQgXsrLy/HJJ58ElRYZysvLy3HnnXfi888/5+7dNDADnaioDi6++GKkpKSYBsv5gtjYWIwYMQLdu3d34Ys0g3379rm4IfgCEjyBCkHq2y1atPD8DtAo7XJzc9G7d288/PDDprMtqVF///vfUVJSgg0bNvg9gEKtxgeSHpWje/fuePPNN3kHM4LqoLCwEM8//7xPnq6hAhl9x44di7Fjx4Y8fWO96TsqANP6IJ6GDx+O4cOHh5wnACgpKUFSUlLQ6VDbfffdd7jnnntQVFSEFi1amJ494Q9IQFx99dXIy8sLmk8zTU6SJKxduzag9IIR4KR5eUuD1xxZmR977DFs377ddHDoHXGWLVuGjh07Bt0AkQbx2rJlS+Tn5yM2NtblOYGEyA8//ICMjAyuwYTTbmEEaQSe/BiCIbPtaUmSsHr1ap63N55CyYumaVAUBZqmobq62qd68WUWpe3Wbdu2ITU11cXGEQxI+wqmvKqquvn6kLZ/8OBBvPvuu7/IccU5oookn4mTJ0969JmgrdYVK1b45EzySwEJO03TMH/+fFx99dWmJxWRYFAUBWlpafj5559Dqn77A3KmCTXpoaoq7HY7SktL8e677wLwbvQMF09mXr5m8GfAk9BYvXo1HnzwQW5/CoXQCKacZDAlUH1LkoSsrCzU1NR4ja1pLri0DvlM7N+/H/fffz+fTYhBEirk63DDDTfglVde4et8X2FMz581WjCzBC2fsrKykJaWZrrsAly1rW3btnHjaLhhLJenchrrIVCimd1qtaK6uhoZGRmm552EKj9P7af/22zi8fSNr3VK4e+LFi3C1KlTeT/wtz+Fow40TeOhDhaLBRMnTkRhYaGLYd0bb+GYqPVpGuvGTZzrYzJmzJjhsjTRaxL6w0qGDx9ueklzUwz5q52YuU77CjJy/vnPf8bs2bO5UDCmQ7PtsmXL8Prrr8Nut0fEbuGPoAgWVH8WiwV2ux1lZWUYNGgQSkpKXNowVPl5gi9CwPgsUJ6oXWfMmIG5c+eaOiCapR2qZYwR+jagaOFhw4YhOzub70CaDVzjZBsueBLqbiOcMcZn3mnTpuGaa67BzTffzKW0vsAUHbhw4UJ888032Lt3r09G0EirVLTmjIuLQ15enktMix5U7h07dmDcuHGQZTkiB/42x7LuzJkz+P7777Fq1SrMmzfPbdlF7RspvkhQ6fuYPjrUOFn5u74nTcNqtWLixImIi4vDX/7yF5d3KG99ACLlHY7o1MrKSuzduxerVq3C0qVLcezYMT6x6aGvBwLVRSjtHPo09WXXw1Ql0EuX9PR0fPHFF+jcubObIwfZA1q3bo133nkHycnJqK+vD7tTkz8gu4XT6cSSJUtwySWXmDqkMHbWWl1VVYWUlBTU1taG3W5Bae/atQu9e/fm/Op5DwRNfadpGk6dOoWysjLOA7Ul4ejRo+jfv3/EDG+Mnd1Wra6u5v1nyZIl+OSTT1yEGL176NAhv2OGGGN8ohg9ejRmz57t8j31AQrIlCQJqampiImJ8aj9eIu50cP4nsPhQEVFBY4ePcqfGSdb+v0///kP+vTp43aEniRJ/DiGUGjBpNVkZ2dj5cqVbmfY8LJ5InLNvu6665iiKKyhocGr27T+xGaz9Oh5Tk6Oy3f63zMzM/m7lP+tt97KGHN1DSc32Y8++siriy65zL7wwguMMc/u75R/SkqK1zL81igQd/pfO/3SyvtragOvRgfyz6CzMV999VXu1KUHScZRo0ahuLgYr7/+utelidk6zBeNxN/3Sb0bMmQInnnmGW7gM35Ldpvs7Gzk5+dHzDlLj0jN5PoZipafzc2TEcYzWry9EwhIM/CmHVAdhbMOKJ+m+pqvvIYKTS1Dm5TGNNuuXLnSTTPQz9LquSvl6FY0Y5AapbN48eKwaxj0bUJCAr/7wUw7onQ+//xzZrPZflXSXpCgSFOT4pOxxsCxBx98kBs2zZy6gLOGoxUrVvAAmOaYpYiX6Oho5Ofn8/MezfwtZPnsfSqjRo3iBs5QS2wBgd8KfBrNpMKdPn0aI0aMQF1dHX+uB+0dx8fHIzc3F4wF59seCMi6q2kasrOzkZSUxJccxjKRWnvfffdFPKhMQODXCJ+nf2OQmqfBZbFYoCgKbr/9dkyfPp37O0QK5GSVmZmJzMxMj/4htIX63HPP4YMPPvA7+lZA4PcIv9YL5NGZm5uLBQsWePSApCPSnn32Wdx1112mM3w4QEbOpKQkZGdne/RAJZ8SfVBZpI2cAgK/RvhtYKCgrEcffRTbt283nZn1vg85OTm44oorgr5duilQfm3atEF+fj6io6NNrb36IwObK6hMQODXioAEBmMM9fX1PEiNwmJdEj4XBnzhhRciLy8PUVFRYR2UlF9OTg4SEhJMTzMig6aiKEhNTcXPP//st/OPgMDvGQFN+aTq79+/H2PGjOGD1cwIqqoq+vbtizlz5oRNy6CjxZ588kncfffd3G5i9PcgO8zkyZN5UJmwWwgI+I6ARy8ZDVevXu1ycZBRaNDzsWPHIjMzM6hj+cxAGsItt9yCGTNmuASV6d1aScgtX74cc+fOFXYLAYEAENR0TzP21KlT8fHHH3u8zZtiMrKzs9G9e3evN2n7C1VVcckll2Dp0qUAzL3UyO6yc+dOPPTQQ25xEwICAr4jOM+vc8ftx8XFsUOHDvFrCcw8QRlj7MSJE+zUqVMuzwLx9CRUV1ezY8eOuXht6kEenlVVVaxHjx6c52DLLUjQ75GCNiiQt2R5eTlGjRrFjaLGpQnFMFxwwQVo06YNfxYsWrZsibi4OB7taAR5eI4bNw7ffvut2+U7AgICviMkFkgKUtu4cSOeeOIJbuw0Exqh3sIkj00z4UP+FtnZ2VixYkVAt6IJCAg0ImRbFuScNWvWLBQUFHj0nAy1qzj5fHjiZ/PmzZg8ebJHo6yAgIDvCJnAoJlelmVkZmZiz549zbYTQXz8/PPPSEtLE0FlAgIhQkidIujEnqqqKqSmpqK2tjbijlF6wZWeni6CygQEQoiQe1GRPeOrr75CVlYW31KN1OwugsoEBMKHsAR3UIRobm4uFi5cyIPUaFngiZpCU9+T3aKwsBDTp0/nxlcBAYHQIGzRYORZOXHiRBQXF4f9uH5yziorKxNBZQICYULYBAbN+g0NDUhNTXW5SS3UR9eT3cIYVCaEhYBAaBHW8/PIdXz//v144IEHPAaphSIfm82GyZMnY8uWLRG7fEhA4PeGsB+4SYN51apVePnll01vUvNV4zC+L0kSd87Ky8vjQWWhjFUREBBoRERO6CV7xlNPPYWioqKQhZVrmga73Y5vv/0WDz30ULNdmCwg8HtBRASG0+nkA3nUqFE4fPhw0BGjdAN3TU0NUlJSUF1dzfMSEBAIDyJ2BwCdg3Hs2DGMHj3aY5CaL6DDcKxWK8aOHYudO3eKw3AEBCKAiF4aQk5Vn376KZ588kk3/4ymoPe3sNvtmDt3LvLy8sRhOAICEULEbxki56qZM2fi3//+N+x2u1+DnYyo27Ztw+TJk4Xbt4BABNEsl2fSGRWZmZnYu3cvbDabT7YHOvOioqICqampUBRFBJUJCEQQzSIwyHmrsrISKSkpqK+v9+mcT3buBrb7778fBw4c8FnQCAgIhAbNcz03Grdav/rqKzz88MOwWq1eBz9jDDabDc8//zwKCwuF3UJAoBnQbAIDaDSC5uTkYP78+ZBl2fRELIfDAUmSsG7dOjz33HM8AlUsRQQEIotmFRhAo6bxyCOPYNeuXTj//PPd3omNjcXhw4eRnp4OACKoTECgmdDsAoMGvqIoyMzMxPHjx12eA0BDQwPGjRuHEydOiCsCBASaEf8Pw+MLiQHbTDoAAAAASUVORK5CYII=" alt="Benda" style={{height:44,width:160,objectFit:"contain"}}/>
      </div></A>
      <A d={60}><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,lineHeight:1.1,marginBottom:8,textAlign:"center"}}>THE RANGE</div></A>
      <A d={100}><div style={{fontSize:13,color:C.t2,lineHeight:1.6,textAlign:"center"}}>5 models. Learn each one inside out.</div></A>
    </div>
    <div style={bd}>
      {BIKES.map((b,i)=>{const m=bm(pr,b.id);return(
        <A key={b.id} d={80+i*50}><HoverCard onClick={()=>onBike(b)} style={{background:"#000",padding:"16px 20px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
          <div style={{width:260,height:180,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {b.icon&&<img src={b.icon} alt={b.name} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>}
          </div>
          <div style={{flex:1,paddingLeft:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:19,letterSpacing:1,textTransform:"uppercase"}}>{b.name}</div>
              {m===100&&<Ring pct={m} sz={22} sw={2}/>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:3}}>
              <span style={{fontSize:11,color:C.t2,letterSpacing:1,textTransform:"uppercase"}}>{b.type}</span>
              <span style={{fontSize:11,color:"#4ade80",fontWeight:600}}>{b.price}</span>
              
            </div>
          </div>
          <div style={{color:C.t3,fontSize:22,flexShrink:0}}>›</div>
        </HoverCard></A>
      )})}
    </div>
  </div>;
}

// ── HOVER CARD ──────────────────────────────────────────────────────────────
function HoverCard({onClick,title,sub,style,children}){
  const [hovered,sH]=useState(false);
  // If children passed, render as a wrapper card with glow border
  if(children){return <div
    onMouseEnter={()=>sH(true)}
    onMouseLeave={()=>sH(false)}
    onClick={onClick}
    style={{
      ...crd,
      ...style,
      border:`1px solid ${hovered?"rgba(255,255,255,0.6)":C.border}`,
      boxShadow:hovered?`0 0 0 1px rgba(255,255,255,0.15)`:"none",
      borderRadius:6,cursor:"pointer",
      transition:"border .2s ease, box-shadow .2s ease",
    }}>
    {children}
  </div>}
  // Otherwise render as a text card (Train tab buttons)
  return <div
    onMouseEnter={()=>sH(true)}
    onMouseLeave={()=>sH(false)}
    onClick={onClick}
    style={{
      background:hovered?C.accent:C.s1,
      border:`1px solid ${hovered?C.accent:C.border}`,
      borderRadius:6,padding:"24px 20px",marginBottom:12,cursor:"pointer",
      transition:"all .2s ease",
    }}>
    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:20,letterSpacing:1,textTransform:"uppercase",marginBottom:4,color:hovered?C.bg:C.text,transition:"color .2s ease"}}>{title}</div>
    <div style={{fontSize:13,color:hovered?C.bg:C.t3,opacity:hovered?.8:1,transition:"color .2s ease"}}>{sub}</div>
  </div>
}

// ── TRAIN TAB ───────────────────────────────────────────────────────────────
function TrainTab({onQuiz,onScenarios,onGlossary}){
  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <A><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,lineHeight:1.1,marginBottom:8}}>TRAINING</div></A>
      <A d={60}><div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>Test your knowledge across the full range.</div></A>
    </div>
    <div style={bd}>
      <A d={100}><HoverCard onClick={onGlossary} title="Glossary" sub="Common motorcycle terms explained plainly"/></A>
      <A d={160}><HoverCard onClick={onQuiz} title="All Models Quiz" sub="12 random questions from every bike and difficulty"/></A>
      <A d={220}><HoverCard onClick={onScenarios} title="Customer Scenarios" sub="Real-world sales situations - pick the right bike"/></A>
      <A d={280}><div style={{...crd,padding:"20px",marginTop:20}}>
        <div style={{fontSize:12,color:C.t2,lineHeight:1.6}}>Per-bike quizzes and flashcards are inside each model page. Tap a bike in the Range tab to access them.</div>
      </div></A>
    </div>
  </div>;
}

// ── PROGRESS TAB ────────────────────────────────────────────────────────────
function ProgressTab({progress:pr,onReset}){
  const ov=om(pr);
  const [confirm,setConfirm]=useState(false);
  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,marginBottom:8}}>PROGRESS</div>
    </div>
    <div style={bd}>
      <A><div style={{textAlign:"center",marginBottom:32}}>
        <div style={{display:"inline-block",position:"relative"}}>
          <Ring pct={ov} sz={100} sw={5}/>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:28}}>{ov}%</span>
          </div>
        </div>
        <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:C.t2,marginTop:8}}>Overall Completion</div>
      </div></A>
      <div style={sec}>Per Model</div>
      {BIKES.map((b,i)=>{const m=bm(pr,b.id);const bq=pr.bikeQuiz[b.id]||{};return(
        <A key={b.id} d={i*50}><div style={{...crd,padding:"16px 18px",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,letterSpacing:1,textTransform:"uppercase"}}>{b.name}</div>
              <div style={{fontSize:11,color:C.t2}}>{b.type}</div>
            </div>
            <Ring pct={m} sz={36} sw={3}/>
          </div>
          <div style={{display:"flex",gap:6}}>
            {["easy","medium","hard"].map(d=>{const data=bq[d];const pc=data?Math.round(data.best/data.total*100):0;const cl=pc===100?C.ok:pc>0?C.accent:C.t4;return(
              <div key={d} style={{flex:1,background:C.bg,borderRadius:4,padding:"8px 6px",textAlign:"center"}}>
                <div style={{fontSize:10,letterSpacing:1,textTransform:"uppercase",color:C.t4,marginBottom:4}}>{d}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:cl}}>{data?`${data.best}/${data.total}`:"—"}</div>
                {data&&<div style={{fontSize:10,color:C.t4}}>{data.attempts}x</div>}
              </div>
            )})}
          </div>
        </div></A>
      )})}
      <div style={{...sec,marginTop:24}}>Other Modes</div>
      <A d={300}><div style={{...crd,padding:"16px 18px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1}}>General Quiz</div><div style={{fontSize:12,color:C.t3}}>{pr.generalQuiz.attempts}x</div></div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:22,color:pr.generalQuiz.best>0?C.accent:C.t4}}>{pr.generalQuiz.total>0?`${pr.generalQuiz.best}/${pr.generalQuiz.total}`:"—"}</div>
        </div>
      </div></A>
      <A d={350}><div style={{...crd,padding:"16px 18px",marginBottom:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,textTransform:"uppercase",letterSpacing:1}}>Scenarios</div><div style={{fontSize:12,color:C.t3}}>{pr.scenarios.attempts}x</div></div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:22,color:pr.scenarios.correct>0?C.accent:C.t4}}>{pr.scenarios.attempts>0?`${pr.scenarios.correct}/${pr.scenarios.completed}`:"—"}</div>
        </div>
      </div></A>
      {!confirm
        ?<button className="tp" style={{...btnG,color:C.t4}} onClick={()=>setConfirm(true)}>Reset All Progress</button>
        :<div style={{display:"flex",gap:8}}>
          <button className="tp" style={{...btnA,flex:1,background:C.no}} onClick={()=>{onReset();setConfirm(false)}}>Confirm Reset</button>
          <button className="tp" style={{...btnG,flex:1}} onClick={()=>setConfirm(false)}>Cancel</button>
        </div>
      }
    </div>
  </div>;
}

// ── QUIZ ENGINE ─────────────────────────────────────────────────────────────
function QE({questions:qs,badge,onFinish}){
  const [idx,sI]=useState(0);
  const [sc,sS]=useState(0);
  const [ch,sC]=useState(null);
  const [sh]=useState(()=>qs.map(q=>[...q.opts].sort(()=>Math.random()-.5)));
  const [an,sA]=useState("");
  function pick(o){if(ch!==null)return;const ok=o===qs[idx].a;if(ok)sS(s=>s+1);sC(o);sA(ok?"ac":"aw");setTimeout(()=>sA(""),400)}
  function next(){if(idx+1>=qs.length){onFinish(sc);return}sI(i=>i+1);sC(null)}

  const q=qs[idx];const os=sh[idx];const tot=qs.length;const pct=((idx+(ch!==null?1:0))/tot)*100;
  return <div style={bd}>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.t2,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>
      <span>Question {idx+1} of {tot}</span>
      <span style={{color:C.accent}}>{sc} correct</span>
    </div>
    <div style={{height:3,background:C.border,borderRadius:3,marginBottom:28,overflow:"hidden"}}>
      <div style={{height:"100%",background:C.accent,borderRadius:3,width:pct+"%",transition:"width .5s ease"}}/>
    </div>
    {badge&&(()=>{const bt=badge(q);const bc=bt.includes("easy")?"#22c55e":bt.includes("medium")?"#f59e0b":bt.includes("hard")?"#ef4444":C.t2;return <div style={{display:"inline-block",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:bc,border:`1px solid ${bc}`,padding:"4px 10px",borderRadius:3,marginBottom:14}}>{bt}</div>})()}
    <A t="as" key={idx}><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:22,lineHeight:1.25,marginBottom:24,letterSpacing:.5}}>{q.q}</div></A>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}} className={an}>
      {os.map(o=>{
        let bg=C.s1,br=C.border,cl=C.text;
        if(ch!==null){if(o===q.a){bg=C.okBg;br=C.okBdr;cl=C.okTxt}else if(o===ch){bg=C.noBg;br=C.noBdr;cl=C.noTxt}else cl=C.t4}
        return <HoverBtn key={o} onClick={()=>pick(o)} disabled={ch!==null} style={{width:"100%",padding:"15px 16px",background:bg,border:`1px solid ${br}`,borderRadius:6,color:cl,fontSize:15,textAlign:"left",cursor:ch===null?"pointer":"default",lineHeight:1.4,transition:"all .15s"}}>{o}</HoverBtn>
      })}
    </div>
    {ch!==null&&<A><div style={{padding:"12px 14px",borderLeft:`3px solid ${ch===q.a?C.ok:C.no}`,fontSize:13,lineHeight:1.6,color:C.t2,marginBottom:ch===q.a?16:8}}>{ch===q.a?"Correct. ":`The answer was ${q.a}. `}{q.fact}</div>
    {ch!==q.a&&<div style={{padding:"8px 14px",background:C.s2,borderRadius:4,marginBottom:16,fontSize:12,color:C.t2}}>
      <span style={{color:C.accent}}>→ </span>Find this in the <span style={{color:C.accent,fontWeight:600}}>{q.tab||"Learn"} tab</span>{q.section?` under "${q.section}"`:""}.
    </div>}
    </A>}
    {ch!==null&&<button className="tp" style={{width:"100%",padding:16,background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase",color:C.text,cursor:"pointer"}} onClick={next}>{idx+1<tot?"Next Question":"See Results"}</button>}
  </div>;
}

// ── RESULTS ─────────────────────────────────────────────────────────────────
function Res({score,total,actions}){
  const pct=Math.round(score/total*100);const tier=getTier(pct);
  return <div style={bd}>
    <div style={{textAlign:"center"}}>
      <A><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:68,lineHeight:1,marginBottom:4}}>{score}<span style={{color:C.accent}}>/{total}</span></div>
      <div style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:C.t2,marginBottom:20}}>{pct}% correct</div></A>
      <A d={200}><div className="at" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 24px",border:`2px solid ${tier.color}`,borderRadius:6,marginBottom:20}}>
        <span style={{fontSize:20,color:tier.color}}>{tier.icon}</span>
        <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,letterSpacing:3,textTransform:"uppercase",color:tier.color}}>{tier.label}</span>
      </div></A>
      <A d={350}><div style={{fontSize:14,color:C.t2,lineHeight:1.6,marginBottom:28,paddingBottom:28,borderBottom:`1px solid ${C.border}`}}>{tier.msg}</div></A>
    </div>
    <A d={450}><div style={{display:"flex",flexDirection:"column",gap:10}}>{actions}</div></A>
  </div>
}

// ── GLOSSARY ITEM ────────────────────────────────────────────────────────────
// ── HOVER BUTTON ────────────────────────────────────────────────────────────
function HoverBtn({onClick,disabled,style,children}){
  const [hovered,sH]=useState(false);
  return <button
    onMouseEnter={()=>!disabled&&sH(true)}
    onMouseLeave={()=>sH(false)}
    onClick={onClick}
    disabled={disabled}
    style={{...style,border:`1px solid ${hovered&&!disabled?"rgba(255,255,255,0.5)":style.border?.includes("1px solid")?style.border.split("solid ")[1].replace(")","").trim():"transparent"}`,boxShadow:hovered&&!disabled?`0 0 0 1px rgba(255,255,255,0.1)`:"none",transition:"border .15s ease, box-shadow .15s ease"}}
  >{children}</button>
}

function GlossaryItem({term,def}){
  const [open,sO]=useState(false);
  return <div style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:open?6:0,marginBottom:open?4:0,overflow:"hidden"}}>
    <div className="tp" onClick={()=>sO(!open)} style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,letterSpacing:1}}>{term}</div>
      <div style={{color:C.t4,fontSize:18,transition:"transform .2s",transform:open?"rotate(45deg)":"rotate(0deg)"}}>+</div>
    </div>
    {open&&<div style={{padding:"0 16px 14px",fontSize:13,color:C.t2,lineHeight:1.7,borderTop:`1px solid ${C.border}`}}><div style={{paddingTop:12}}>{def}</div></div>}
  </div>
}

// ── LEARN TAB ───────────────────────────────────────────────────────────────
function LearnTab({bike:b}){
  return <div style={bd}>
    <A><div style={{marginBottom:20}}>
      <div style={{width:"100%",height:240,borderRadius:6,marginBottom:8,background:C.s2,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:12,color:C.t4,letterSpacing:1}}>IMAGE PLACEHOLDER</span>
      </div>
    </div></A>
    <A d={60}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:26,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>{b.name}</div>
      <div style={{fontSize:14,color:"#4ade80",fontWeight:600,marginBottom:4,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>{b.price}</div>
      <div style={{fontSize:12,color:C.t2,letterSpacing:2,textTransform:"uppercase",marginBottom:24}}>{b.type}</div>
    </A>
    <A d={120}><div style={{border:`1px solid ${C.border}`,borderRadius:6,overflow:"hidden",marginBottom:24}}>
      {[["Type",b.anchors.type],["Feel",b.anchors.feel],["Who",b.anchors.who]].map(([l,v],i,a)=>(
        <div key={l} style={{background:C.s1,padding:"16px 18px",display:"flex",gap:14,alignItems:"baseline",...(i<a.length-1?{borderBottom:`1px solid ${C.border}`}:{})}}>
          <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.accent,fontWeight:600,width:44,flexShrink:0}}>{l}</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:17,letterSpacing:.5,lineHeight:1.2}}>{v}</div>
        </div>
      ))}
    </div></A>
    <A d={180}><div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
      {b.captions.map(c=><div key={c.label} style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:4,padding:"7px 12px",fontSize:12}}>
        <span style={{fontWeight:500}}>{c.label}: </span><span style={{color:C.t2}}>{c.value}</span>
      </div>)}
    </div></A>
    <A d={240}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,border:`1px solid ${C.border}`,borderRadius:6,overflow:"hidden",marginBottom:24}}>
      {b.stats.map(s=><div key={s.key} style={{background:C.s1,padding:16,textAlign:"center"}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:24,lineHeight:1,marginBottom:4}}>{s.val}</div>
        <div style={{fontSize:10,color:C.t2,letterSpacing:1,textTransform:"uppercase"}}>{s.key}</div>
      </div>)}
    </div></A>
    <A d={300}><div style={{...sec,marginBottom:14}}>Key Facts</div>
    <div style={{display:"flex",flexDirection:"column",gap:1}}>
      {b.facts.map((f,i)=><div key={i} style={{background:C.s1,padding:"16px 18px",display:"flex",gap:14,alignItems:"baseline"}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:20,color:C.accent,lineHeight:1,flexShrink:0,width:28}}>0{i+1}</div>
        <div><div style={{fontWeight:500,fontSize:14,marginBottom:3,textAlign:"left"}}>{f.title}</div><div style={{fontSize:13,color:C.t2,lineHeight:1.5}}>{f.desc}</div></div>
      </div>)}
    </div></A>
    {b.sellingPoints&&<A d={400}><div style={{height:1,background:C.border,margin:"24px 0"}}/>
      <div style={{...sec,marginBottom:14}}>Sales Playbook</div>
      {b.sellingPoints.map((sp,i)=><div key={i} style={{...crd,padding:"14px 16px",marginBottom:8}}>
        <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.accent,fontWeight:600,marginBottom:6,textAlign:"left"}}>{sp.title}</div>
        <div style={{fontSize:13,color:"#ccc",lineHeight:1.6,textAlign:"left"}}>{sp.text}</div>
      </div>)}
    </A>}
  </div>
}

// ── SPECS TAB ───────────────────────────────────────────────────────────────
function SpecsTab({bike:b}){
  return <div style={bd}>
    {b.specs.map((g,gi)=><A key={g.group} d={gi*80}><div style={{marginBottom:24}}>
      <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,paddingBottom:10,borderBottom:`1px solid ${C.border}`,fontWeight:600}}>{g.group}</div>
      {g.rows.map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"11px 0",borderBottom:`1px solid ${C.border}`,gap:16}}>
        <span style={{fontSize:13,color:C.t2}}>{k}</span>
        <span style={{fontSize:13,fontWeight:500,textAlign:"right"}}>{v}</span>
      </div>)}
    </div></A>)}
  </div>
}

// ── FLASHCARDS TAB ──────────────────────────────────────────────────────────
function FlashTab({bike:b}){
  const [idx,sI]=useState(0);
  const [flipped,sF]=useState(false);
  const [confident,sC]=useState(new Set());
  const [study,sS]=useState(new Set());
  const [mode,sM]=useState("all");
  const [flash,setFlash]=useState(null); // 'ok' | 'no' | null
  const cards=b.flashcards||[];
  const pool=mode==="study"?[...study]:[...Array(cards.length).keys()];
  const ri=pool[idx%pool.length]??0;
  const card=cards[ri];const tot=pool.length;

  if(!cards.length)return <div style={bd}><div style={{color:C.t3}}>No flashcards.</div></div>;

  function markOk(){
    setFlash('ok');
    sC(p=>new Set([...p,ri]));
    sS(p=>{const n=new Set(p);n.delete(ri);return n});
    setTimeout(()=>{setFlash(null);sF(false);sI(i=>(i+1)%Math.max(pool.length,1))},700);
  }
  function markStudy(){
    setFlash('no');
    sS(p=>new Set([...p,ri]));
    setTimeout(()=>{setFlash(null);sF(false);sI(i=>(i+1)%Math.max(pool.length,1))},500);
  }
  function adv(){sF(false);sI(i=>(i+1)%Math.max(pool.length,1))}

  const allDone=confident.size===cards.length;
  const bikeCol=BIKE_COLOURS[b.id]||"#a855f7";
  const cardBorder=flash==='ok'?"#22c55e":flash==='no'?"#ef4444":flash?C.border:flipped?bikeCol:C.border;
  return <div style={bd}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
      <div style={{fontSize:12,color:C.t2,letterSpacing:1}}>
        {mode==="study"?`Reviewing ${study.size}`:`${idx%cards.length+1} / ${cards.length}`}
      </div>
      <div style={{display:"flex",gap:12}}>
        {confident.size>0&&<span style={{fontSize:11,color:C.okTxt}}>✓ {confident.size}</span>}
        {study.size>0&&<span style={{fontSize:11,color:C.noTxt}}>✗ {study.size}</span>}
      </div>
    </div>
    {study.size>0&&mode==="all"&&<div className="tp" onClick={()=>{sM("study");sI(0);sF(false)}} style={{background:C.noBg,border:`1px solid ${C.noBdr}`,borderRadius:6,padding:"12px 14px",marginBottom:16,textAlign:"center"}}>
      <span style={{fontSize:13,color:C.noTxt,fontWeight:500}}>Focus on {study.size} card{study.size!==1?"s":""} to study</span>
    </div>}
    {mode==="study"&&<div className="tp" onClick={()=>{sM("all");sI(0);sF(false)}} style={{...crd,padding:"12px 14px",marginBottom:16,textAlign:"center"}}>
      <span style={{fontSize:13,color:C.t3}}>Back to all cards</span>
    </div>}
    <div style={{position:"relative",marginBottom:24}}>
      <div style={{position:"absolute",top:6,left:8,right:8,height:"100%",background:C.s2,borderRadius:8,border:`1px solid ${C.border}`,opacity:.3}}/>
      <div style={{position:"absolute",top:3,left:4,right:4,height:"100%",background:C.s2,borderRadius:8,border:`1px solid ${C.border}`,opacity:.5}}/>
      <div className="tp" onClick={()=>sF(!flipped)} style={{position:"relative",background:flipped?C.s2:C.s1,border:`1px solid ${cardBorder}`,borderRadius:8,overflow:"hidden",padding:"48px 28px 28px",minHeight:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",transition:"all .2s ease",boxShadow:flash==="ok"?`0 0 0 3px #22c55e,0 0 20px #22c55e66`:flash==="no"?`0 0 0 3px #ef4444,0 0 20px #ef444466`:flipped?`0 0 20px ${bikeCol}33`:"none"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:flash==="ok"?"#22c55e":flash==="no"?"#ef4444":bikeCol}}/>
        <div style={{position:"absolute",top:12,left:0,right:0,textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:flash==="ok"?"#22c55e":flash==="no"?"#ef4444":bikeCol,opacity:.8}}>{b.name}</div>
        <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:flash==="ok"?"#22c55e":flash==="no"?"#ef4444":flipped?bikeCol:C.t4,marginBottom:20,fontWeight:600}}>{flipped?"Answer":"Question"}</div>
        <div key={`${ri}-${flipped}`} className="af" style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:flipped?24:20,letterSpacing:.5,lineHeight:1.3,color:flipped?C.text:"#ccc"}}>
          {flipped?card.back:card.front}
        </div>
        {!flipped&&<div style={{fontSize:12,color:C.t4,marginTop:20}}>Tap to reveal</div>}
      </div>
    </div>
    {flipped?(
      <A><div style={{display:"flex",gap:10}}>
        <button className="tp" onClick={markStudy} style={{flex:1,padding:16,background:C.noBg,border:`1px solid ${C.noBdr}`,borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,textTransform:"uppercase",color:C.noTxt,cursor:"pointer"}}>Not Quite</button>
        <button className="tp" onClick={markOk} style={{flex:1,padding:16,background:C.okBg,border:`1px solid ${C.okBdr}`,borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,textTransform:"uppercase",color:C.okTxt,cursor:"pointer"}}>Got It</button>
      </div></A>
    ):(
      <div style={{display:"flex",gap:8}}>
        <button className="tp" style={{...btnG,flex:1,padding:14}} onClick={()=>{sF(false);sI(i=>(i-1+cards.length)%cards.length)}}>Prev</button>
        <button className="tp" style={{...btnG,flex:1,padding:14}} onClick={()=>{sF(false);sI(i=>(i+1)%cards.length)}}>Next</button>
      </div>
    )}
    {allDone&&<A d={200}><div style={{textAlign:"center",marginTop:20,padding:16,background:C.okBg,border:`1px solid ${C.okBdr}`,borderRadius:6}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:C.okTxt,textTransform:"uppercase",letterSpacing:1}}>All cards done!</div>
    </div></A>}
  </div>;
}

// ── QUIZ TAB ────────────────────────────────────────────────────────────────
function QuizTab({bike:b,onLearn,onUp,onNext}){
  const [phase,sP]=useState("start");
  const [diff,sD]=useState("easy");
  const [qs,sQ]=useState([]);
  const [sc,sS]=useState(0);
  const [wrong,sW]=useState([]);

  function start(){const q=[...b.questions[diff]].sort(()=>Math.random()-.5);sQ(q);sS(0);sP("quiz")}
  function fin(s){sS(s);onUp(b.id,diff,s,qs.length);sP("results")}

  const nd=diff==="easy"?"medium":diff==="medium"?"hard":null;
  const nxt=nb(b.id);
  const pct=qs.length>0?Math.round(sc/qs.length*100):0;

  if(phase==="start")return <div style={bd}>
    <A><div style={sec}>{b.name} Quiz</div><div style={{fontSize:13,color:C.t2,lineHeight:1.6,marginBottom:24}}>Test your knowledge. All answers are in the Learn tab.</div></A>
    <A d={100}><div style={{display:"flex",gap:8,marginBottom:24}}>
      {[["easy","Easy","Key facts","#22c55e"],["medium","Medium","Specs & details","#f59e0b"],["hard","Hard","Deep numbers","#ef4444"]].map(([d,l,desc,col])=>(
        <div key={d} className="tp" style={{flex:1,padding:"13px 8px",border:`1px solid ${diff===d?col:C.border}`,background:diff===d?`${col}18`:C.s1,borderRadius:6,textAlign:"center",transition:"all .2s"}} onClick={()=>sD(d)}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:1,textTransform:"uppercase",marginBottom:3,color:col}}>{l}</div>
          <div style={{fontSize:11,color:C.t2}}>{desc}</div>
        </div>
      ))}
    </div></A>
    <A d={200}><button className="tp" style={btnA} onClick={start}>Start Quiz</button></A>
  </div>;

  if(phase==="results")return <Res score={sc} total={qs.length} actions={<>
    {pct===100&&nd&&<button className="tp" style={btnA} onClick={()=>{sD(nd);sP("start")}}>Level Up to {nd[0].toUpperCase()+nd.slice(1)}</button>}
    {pct===100&&!nd&&nxt&&<button className="tp" style={btnA} onClick={()=>onNext(nxt)}>Next Bike: {nxt.name}</button>}
    <button className="tp" style={pct<100?btnA:btnG} onClick={()=>sP("start")}>Try {diff} Again</button>
    <button className="tp" style={btnG} onClick={onLearn}>Review Learn Tab</button>
  </>}/>;

  return <QE questions={qs} badge={()=>diff} onFinish={fin}/>;
}

// ── BIKE SCREEN ─────────────────────────────────────────────────────────────
function BikeScreen({bike:b,onBack,onUp,onChange}){
  const [tab,sT]=useState("learn");
  const tabs=["learn","specs","quiz","cards"];
  const labels={learn:"Learn",specs:"Specs",quiz:"Quiz",cards:"Cards"};
  return <div style={{paddingBottom:0}}>
    <Hdr title={b.name} onBack={onBack}/>
    <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
      {tabs.map(t=><button key={t} style={{flex:1,padding:"13px 8px",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:tab===t?C.text:C.t2,border:"none",background:"none",cursor:"pointer",borderBottom:tab===t?`2px solid ${C.accent}`:"2px solid transparent",marginBottom:-1}} onClick={()=>sT(t)}>{labels[t]}</button>)}
    </div>
    {tab==="learn"&&<LearnTab bike={b}/>}
    {tab==="specs"&&<SpecsTab bike={b}/>}
    {tab==="cards"&&<FlashTab bike={b}/>}
    {tab==="quiz"&&<QuizTab bike={b} onLearn={()=>sT("learn")} onUp={onUp} onNext={onChange}/>}
  </div>;
}

// ── GENERAL QUIZ SCREEN ─────────────────────────────────────────────────────
function GQScreen({onBack,onFin}){
  const allQ=[...BIKES.flatMap(b=>Object.entries(b.questions).flatMap(([d,qs])=>qs.map(q=>({...q,bike:b.name,difficulty:d})))),...COMPQ];
  const [qs]=useState(()=>{
    const pool=[...allQ];
    // Double shuffle to ensure thorough mixing across bikes
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    return pool.slice(0,12);
  });
  const [sc,sS]=useState(null);
  function fin(s){onFin(s,qs.length);sS(s)}
  return <div>
    <Hdr title="All Models Quiz" onBack={onBack}/>
    {sc!==null
      ?<Res score={sc} total={qs.length} actions={<button className="tp" style={btnG} onClick={onBack}>Back</button>}/>
      :<QE questions={qs} badge={q=>`${q.bike} · ${q.difficulty}`} onFinish={fin}/>
    }
  </div>;
}

// ── SCENARIOS SCREEN ────────────────────────────────────────────────────────
function ScScreen({onBack,onFin}){
  const [scs]=useState(()=>[...SCENARIOS].sort(()=>Math.random()-.5).slice(0,6));
  const [idx,sI]=useState(0);
  const [ch,sC]=useState(null);
  const [sc,sS]=useState(0);
  const [phase,sP]=useState("active");
  const [an,sA]=useState("");
  function pick(id){if(ch!==null)return;const ok=id===scs[idx].answer;if(ok)sS(s=>s+1);sC(id);sA(ok?"ac":"aw");setTimeout(()=>sA(""),400)}
  function next(){if(idx+1>=scs.length){onFin(sc,scs.length);sP("results")}else{sI(i=>i+1);sC(null)}}

  if(phase==="results")return <div><Hdr title="Scenarios" onBack={onBack}/><Res score={sc} total={scs.length} actions={<button className="tp" style={btnG} onClick={onBack}>Back</button>}/></div>;

  const s=scs[idx];const tot=scs.length;const pct=((idx+(ch!==null?1:0))/tot)*100;
  const cb=BIKES.find(b=>b.id===s.answer);

  return <div>
    <Hdr title="Customer Scenarios" onBack={onBack}/>
    <div style={bd}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.t2,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>
        <span>Scenario {idx+1} of {tot}</span><span style={{color:C.accent}}>{sc} correct</span>
      </div>
      <div style={{height:3,background:C.border,borderRadius:3,marginBottom:28,overflow:"hidden"}}>
        <div style={{height:"100%",background:C.accent,borderRadius:3,width:pct+"%",transition:"width .5s ease"}}/>
      </div>
      <div style={{display:"inline-block",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.t3,border:`1px solid ${C.border}`,padding:"4px 10px",borderRadius:3,marginBottom:14}}>{s.difficulty}</div>
      <A t="as" key={idx}><div style={{...crd,padding:"18px 20px",marginBottom:24}}>
        <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.accent,fontWeight:600,marginBottom:10}}>Customer Walks In</div>
        <div style={{fontSize:15,lineHeight:1.6,color:"#ddd"}}>{s.situation}</div>
      </div></A>
      <div style={{fontSize:12,color:C.t2,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Which bike?</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}} className={an}>
        {s.opts.map(id=>{
          const bk=BIKES.find(b=>b.id===id);
          let bg=C.s1,br=C.border,cl=C.text;
          if(ch!==null){if(id===s.answer){bg=C.okBg;br=C.okBdr;cl=C.okTxt}else if(id===ch){bg=C.noBg;br=C.noBdr;cl=C.noTxt}else cl=C.t4}
          return <HoverBtn key={id} onClick={()=>pick(id)} disabled={ch!==null} style={{width:"100%",padding:"15px 16px",background:bg,border:`1px solid ${br}`,borderRadius:6,color:cl,fontSize:15,textAlign:"left",cursor:ch===null?"pointer":"default",lineHeight:1.4}}>
            <span style={{fontWeight:600}}>{bk.name}</span><span style={{color:C.t2,marginLeft:8,fontSize:13}}>{bk.type}</span>
          </HoverBtn>
        })}
      </div>
      {ch!==null&&<A>
        <div style={{padding:"12px 14px",borderLeft:`3px solid ${ch===s.answer?C.ok:C.no}`,fontSize:13,lineHeight:1.6,color:C.t2,marginBottom:16}}>
          {ch===s.answer?`Correct - ${cb.name}. `:`The answer was ${cb.name}. `}{s.reasoning}
        </div>
        <div style={{...crd,padding:"14px 16px",marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.accent,fontWeight:600,marginBottom:10}}>{cb.name}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,borderRadius:4,overflow:"hidden"}}>
            {cb.stats.map(st=><div key={st.key} style={{background:C.bg,padding:"10px 12px",textAlign:"center"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,lineHeight:1,marginBottom:2}}>{st.val}</div>
              <div style={{fontSize:10,color:C.t4,letterSpacing:1,textTransform:"uppercase"}}>{st.key}</div>
            </div>)}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12}}>
            <span style={{color:C.t3}}>{cb.type}</span>
            <span style={{color:"#4ade80",fontWeight:600}}>{cb.price}</span>
          </div>
        </div>
      </A>}
      {ch!==null&&<button className="tp" style={{width:"100%",padding:16,background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,letterSpacing:2,textTransform:"uppercase",color:C.text,cursor:"pointer"}} onClick={next}>{idx+1<tot?"Next Scenario":"See Results"}</button>}
    </div>
  </div>;
}

// ── COMPARE TAB ─────────────────────────────────────────────────────────────
function CompareTab(){
  const [a,sA]=useState(BIKES[0].id);
  const [b,sB]=useState(BIKES[1].id);
  const bA=BIKES.find(x=>x.id===a);const bB=BIKES.find(x=>x.id===b);
  const k=compKey(a,b);const v=k?COMP[k]:null;
  const sL=["Max Power","Torque","Weight","Seat"];
  const sAv=Object.fromEntries(bA.stats.map(s=>[s.key,s.val]));
  const sBv=Object.fromEntries(bB.stats.map(s=>[s.key,s.val]));

  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,marginBottom:8}}>COMPARE</div>
    </div>
    <div style={{padding:"20px 20px 0"}}>
      <div style={{...sec,marginBottom:10}}>Pick two bikes</div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        {[{v:a,s:sA},{v:b,s:sB}].map(({v:val,s:set},i)=>(
          <select key={i} style={{flex:1,padding:"13px 12px",background:C.s1,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,letterSpacing:1}} value={val} onChange={e=>set(e.target.value)}>
            {BIKES.map(bk=><option key={bk.id} value={bk.id}>{bk.name}</option>)}
          </select>
        ))}
      </div>
    </div>
    {a===b
      ?<div style={{padding:20,color:C.t3,fontSize:14}}>Select two different bikes.</div>
      :<div style={{padding:"0 20px 40px"}}>
        <A key={a+b}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {[bA,bB].map(bk=><div key={bk.id} style={{...crd,background:"#000",overflow:"hidden",textAlign:"center"}}>
              <div style={{width:"100%",height:70,background:C.s2,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:10,color:C.t4,letterSpacing:1}}>IMG</span>
              </div>
              <div style={{padding:"10px 12px"}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>{bk.name}</div>
                <div style={{fontSize:11,color:C.t2,letterSpacing:1,textTransform:"uppercase"}}>{bk.type}</div>
                <div style={{fontSize:12,color:"#4ade80",marginTop:4,fontWeight:600}}>{bk.price}</div>
              </div>
            </div>)}
          </div>
          <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,padding:"16px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:2,fontWeight:600}}>At a Glance</div>
          {["type","feel","who"].map(k=>{
            const ls={type:"Type",feel:"Feel",who:"Best for"};
            return <div key={k} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:1}}>
              {[bA,bB].map(bk=><div key={bk.id} style={{background:C.s1,padding:"12px 14px"}}>
                <div style={{fontSize:10,letterSpacing:1,textTransform:"uppercase",color:C.t3,marginBottom:4}}>{ls[k]}</div>
                <div style={{fontSize:13,fontWeight:500}}>{bk.anchors[k]}</div>
              </div>)}
            </div>
          })}
          <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,padding:"16px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:2,fontWeight:600}}>Key Numbers</div>
          {sL.map(l=><div key={l} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:C.border,marginBottom:1}}>
            {[sAv,sBv].map((sv,i)=><div key={i} style={{background:C.s1,padding:"12px 14px"}}>
              <div style={{fontSize:10,letterSpacing:1,textTransform:"uppercase",color:C.t3,marginBottom:4}}>{l}</div>
              <div style={{fontSize:13,fontWeight:500}}>{sv[l]||"—"}</div>
            </div>)}
          </div>)}
          {v&&<>
            <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,padding:"16px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:2,fontWeight:600}}>What They Share</div>
            {v.same.map((s,i)=><div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.t2,display:"flex",gap:10}}>
              <span style={{color:C.okTxt,flexShrink:0,fontWeight:700}}>=</span><span>{s}</span>
            </div>)}
            <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,padding:"16px 0 10px",borderBottom:`1px solid ${C.border}`,marginBottom:2,fontWeight:600}}>Key Differences</div>
            {v.diff.map((d,i)=><div key={i} style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.t2,display:"flex",gap:10}}>
              <span style={{color:C.noTxt,flexShrink:0,fontWeight:700}}>/</span><span>{d}</span>
            </div>)}
            <div style={{background:C.s2,border:`1px solid ${C.border}`,borderRadius:6,padding:18,marginTop:20}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,letterSpacing:2,textTransform:"uppercase",color:C.accent,marginBottom:10}}>Sales Verdict</div>
              <div style={{fontSize:14,color:"#aaa",lineHeight:1.7}}>{v.verdict}</div>
            </div>
          </>}
        </A>
      </div>
    }
  </div>;
}

// ── GLOSSARY TAB ────────────────────────────────────────────────────────────
function GlossaryTab(){
  const [open,sO]=useState(null);
  return <div style={{paddingBottom:80}}>
    <div style={{padding:"40px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <A><div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:32,letterSpacing:1,lineHeight:1.1,marginBottom:8}}>GLOSSARY</div></A>
      <A d={60}><div style={{fontSize:13,color:C.t3,lineHeight:1.6}}>Common motorcycle terms explained plainly.</div></A>
    </div>
    <div style={{padding:"24px 20px 40px"}}>
      {GLOSSARY.map((cat,ci)=>(
        <A key={cat.category} d={ci*60}>
          <div style={{...sec,marginBottom:12,marginTop:ci>0?28:0}}>{cat.category}</div>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            {cat.terms.map((t,ti)=>{
              const key=`${ci}-${ti}`;
              const isOpen=open===key;
              return <div key={t.term} style={{background:C.s1,border:`1px solid ${C.border}`,borderRadius:isOpen?6:0,marginBottom:isOpen?4:0,overflow:"hidden",transition:"all .2s"}}>
                <div className="tp" onClick={()=>sO(isOpen?null:key)} style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,letterSpacing:1}}>{t.term}</div>
                  <div style={{color:C.t4,fontSize:18,transition:"transform .2s",transform:isOpen?"rotate(45deg)":"rotate(0deg)"}}>+</div>
                </div>
                {isOpen&&<A><div style={{padding:"0 18px 16px",fontSize:14,color:C.t2,lineHeight:1.7,borderTop:`1px solid ${C.border}`}}><div style={{paddingTop:14}}>{t.def}</div></div></A>}
              </div>
            })}
          </div>
        </A>
      ))}
    </div>
  </div>;
}

// ── APP ─────────────────────────────────────────────────────────────────────
function App(){
  const [screen,sS]=useState("main");
  const [tab,sT]=useState("range");
  const [bike,sB]=useState(null);
  const {p,up,rst}=useProg();

  function openBike(b){sB(b);sS("bike");window.scrollTo(0,0)}
  function bqFin(id,d,sc,tot){up(pr=>{if(!pr.bikeQuiz[id])pr.bikeQuiz[id]={};const pv=pr.bikeQuiz[id][d];pr.bikeQuiz[id][d]={best:pv?Math.max(pv.best,sc):sc,total:tot,attempts:pv?pv.attempts+1:1};return pr})}
  function gqFin(sc,tot){up(pr=>{pr.generalQuiz={best:Math.max(pr.generalQuiz.best,sc),total:tot,attempts:pr.generalQuiz.attempts+1};return pr})}
  function scFin(sc,tot){up(pr=>{pr.scenarios={completed:pr.scenarios.completed+tot,correct:pr.scenarios.correct+sc,attempts:pr.scenarios.attempts+1};return pr})}

  return <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"'Outfit',sans-serif",fontSize:15}}>
    <style>{CSS}</style>
{screen==="main"&&<>
      {tab==="range"&&<RangeTab onBike={openBike} progress={p}/>}
      {tab==="train"&&<TrainTab onQuiz={()=>sS("gquiz")} onScenarios={()=>sS("scenarios")} onGlossary={()=>sS("glossary")}/>}
      {tab==="compare"&&<CompareTab/>}
      {tab==="progress"&&<ProgressTab progress={p} onReset={rst}/>}
      <TabBar active={tab} onChange={sT}/>
    </>}
    {screen==="bike"&&bike&&<BikeScreen bike={bike} onBack={()=>sS("main")} onUp={bqFin} onChange={b=>{sB(b)}}/>}
    {screen==="gquiz"&&<GQScreen onBack={()=>sS("main")} onFin={gqFin}/>}
    {screen==="scenarios"&&<ScScreen onBack={()=>sS("main")} onFin={scFin}/>}
    {screen==="glossary"&&<div>
      <Hdr title="Glossary" onBack={()=>sS("main")}/>
      <div style={{padding:"24px 20px 80px"}}>
        {GLOSSARY.map((cat,ci)=>(
          <A key={cat.category} d={ci*60}>
            <div style={{...sec,marginBottom:12,marginTop:ci>0?28:0}}>{cat.category}</div>
            <div style={{display:"flex",flexDirection:"column",gap:1}}>
              {cat.terms.map(t=><GlossaryItem key={t.term} term={t.term} def={t.def}/>)}
            </div>
          </A>
        ))}
      </div>
    </div>}
  </div>;
}

export default App;
