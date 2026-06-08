import type { TreeMap } from './types';

/**
 * T.R.A.C.E. diagnostic decision tree.
 *
 * Each node is keyed by a stable id. Node `type` drives how it renders:
 *   - 'unit-select' : pick the equipment type (entry node)
 *   - 'yn'          : yes / no / unsure question
 *   - 'choice'      : list of labelled answers
 *   - 'outcome'     : terminal finding with steps / tools / safety flag
 *
 * The tree is intentionally a plain typed data structure so it can later be
 * lifted into JSON, a CMS, or an API without touching the rendering layer.
 */
export const TREE: TreeMap = {

  start:{
    phase:'Equipment',phasePip:'grey',
    question:'What type of equipment are you working on?',
    context:'Select the type of system — this determines the diagnostic path.',
    type:'unit-select',
    units:[
      {id:'ac',    icon:'❄️', name:'A/C',                   sub:'Central split cooling only',      next:'complaint_ac'},
      {id:'hp',    icon:'🔄', name:'Heat Pump',              sub:'Cooling + heating reversible',    next:'complaint_hp'},
      {id:'pkg',   icon:'📦', name:'Package / RTU',          sub:'All-in-one or rooftop unit',      next:'complaint_pkg'},
      {id:'furnace',icon:'🔥',name:'Gas Furnace',            sub:'Heating only, gas-fired',         next:'complaint_furnace'},
      {id:'boiler',icon:'♨️', name:'Boiler',                 sub:'Hydronic / radiant heating',      next:'complaint_boiler'},
      {id:'mini',  icon:'🌡️', name:'Mini-Split',             sub:'Ductless, single or multi-zone',  next:'complaint_mini'},
      {id:'ref',   icon:'🧊', name:'Comm. Refrigeration',    sub:'Walk-in, reach-in, display case', next:'complaint_ref'},
      {id:'ahu',   icon:'💨', name:'Air Handler',            sub:'AHU or fan coil unit only',       next:'complaint_ahu'},
      {id:'other', icon:'🔧', name:'Other / Advanced',       sub:'PTAC, Space Pak, unusual equip',  next:'complaint_other'},
    ],
  },

  // ── COMPLAINTS — filtered per unit type ──

  complaint_ac:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'A/C — cooling only system. What are they telling you?',
    type:'choice',
    answers:[
      {label:'Not cooling',             sub:'Running but not keeping up or no cold air',  style:'',    next:'power_check'},
      {label:'Not running at all',      sub:'Completely dead, nothing happening',          style:'',    next:'power_check'},
      {label:'Short cycling',           sub:'Starts then shuts off after a short time',   style:'',    next:'power_check'},
      {label:'Making a noise',          sub:'Banging, squealing, clicking, rattling',     style:'',    next:'power_check'},
      {label:'Tripping breaker',        sub:'Keeps losing power at the panel',            style:'', next:'power_check'},
      {label:'Error / fault code',      sub:'Display or board showing a fault',           style:'',    next:'power_check'},
      {label:'Leaking water',           sub:'Water around the air handler or drain',      style:'',    next:'power_check'},
      {label:'Running constantly',      sub:'Never shuts off, high energy bill',          style:'',    next:'power_check'},
      {label:'Freezing up / iced over', sub:'Ice on lines or indoor coil',               style:'', next:'power_check'},
    ]
  },

  complaint_hp:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'Heat pump — heating and cooling system. What mode were they in when the problem started?',
    type:'choice',
    answers:[
      {label:'Not cooling',               sub:'In cooling mode, not conditioning',          style:'',    next:'power_check'},
      {label:'Not heating',               sub:'In heating mode, not producing heat',        style:'',    next:'power_check'},
      {label:'Not running at all',         sub:'Completely dead, nothing happening',         style:'',    next:'power_check'},
      {label:'Short cycling',              sub:'Starts then shuts off quickly',              style:'',    next:'power_check'},
      {label:'Stuck in one mode',          sub:'Won\'t switch between heating and cooling',  style:'',    next:'power_check'},
      {label:'Not defrosting',             sub:'Ice building up on outdoor unit in heat mode',style:'',next:'power_check'},
      {label:'Making a noise',             sub:'Banging, squealing, clicking, rattling',     style:'',    next:'power_check'},
      {label:'Tripping breaker',           sub:'Keeps losing power',                         style:'', next:'power_check'},
      {label:'Error / fault code',         sub:'Display or board showing a fault',           style:'',    next:'power_check'},
      {label:'Leaking water',              sub:'Water around indoor unit or drain',          style:'',    next:'power_check'},
      {label:'Running constantly',         sub:'Never shuts off, high energy bill',          style:'',    next:'power_check'},
    ]
  },

  complaint_pkg:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'Package unit / RTU — what are they reporting?',
    type:'choice',
    answers:[
      {label:'Not cooling',          sub:'Running but not conditioning',               style:'',    next:'power_check'},
      {label:'Not heating',          sub:'No heat — gas or electric heat section',     style:'',    next:'power_check'},
      {label:'Not running at all',   sub:'Completely dead',                            style:'',    next:'power_check'},
      {label:'Short cycling',        sub:'Starts then shuts off quickly',              style:'',    next:'power_check'},
      {label:'Making a noise',       sub:'Banging, squealing, clicking, rattling',     style:'',    next:'power_check'},
      {label:'Tripping breaker',     sub:'Keeps losing power',                         style:'', next:'power_check'},
      {label:'Error / fault code',   sub:'Display or board showing a fault',           style:'',    next:'power_check'},
      {label:'Economizer issue',     sub:'Economizer stuck open or closed',            style:'',    next:'power_check'},
      {label:'Leaking water',        sub:'Condensate issue or drain backed up',        style:'',    next:'power_check'},
      {label:'Running constantly',   sub:'Never shuts off, high energy bill',          style:'',    next:'power_check'},
    ]
  },

  complaint_furnace:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'Gas furnace — heating only system. What are they describing?',
    type:'choice',
    answers:[
      {label:'No heat at all',            sub:'Furnace not producing any heat',              style:'',    next:'power_check'},
      {label:'Not running at all',         sub:'Completely dead, no response',                style:'',    next:'power_check'},
      {label:'Lights then shuts off',      sub:'Ignites briefly then locks out',              style:'', next:'power_check'},
      {label:'Short cycling',              sub:'Runs briefly then shuts off repeatedly',      style:'',    next:'power_check'},
      {label:'Not enough heat',            sub:'Running but not keeping up',                  style:'',    next:'power_check'},
      {label:'Making a noise',             sub:'Banging, rumbling, squealing on startup',     style:'',    next:'power_check'},
      {label:'Tripping breaker',           sub:'Keeps losing power',                          style:'', next:'power_check'},
      {label:'Error / fault code',         sub:'LED flashing a fault sequence',               style:'',    next:'power_check'},
      {label:'Smell of gas or burning',    sub:'Odor present near the unit',                  style:'', next:'power_check'},
      {label:'Blower runs but no heat',    sub:'Fan comes on but burner doesn\'t light',      style:'',    next:'power_check'},
      {label:'Overheating / limit trips',  sub:'High limit tripping, unit cycling on limit',  style:'', next:'power_check'},
    ]
  },

  complaint_boiler:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'Boiler — hydronic heating system. What are they describing?',
    type:'choice',
    answers:[
      {label:'No heat in the building',     sub:'Boiler not firing or zones not heating',    style:'',    next:'power_check'},
      {label:'One zone not heating',         sub:'Other zones work, one doesn\'t',            style:'',    next:'power_check'},
      {label:'Boiler not firing',            sub:'Calls for heat but won\'t ignite',          style:'',    next:'power_check'},
      {label:'Low system pressure',          sub:'Pressure gauge reading low, losing water',  style:'', next:'power_check'},
      {label:'High pressure / relief valve', sub:'Pressure relief valve opening or dripping', style:'', next:'power_check'},
      {label:'Making a noise',               sub:'Banging, kettling, gurgling',               style:'',    next:'power_check'},
      {label:'Error / lockout code',         sub:'Display showing a fault',                   style:'',    next:'power_check'},
      {label:'Leaking water',                sub:'Water around boiler or at fittings',        style:'', next:'power_check'},
      {label:'Not enough heat',              sub:'Running but not keeping up',                 style:'',    next:'power_check'},
      {label:'Smell of gas',                 sub:'Gas odor near the boiler',                  style:'', next:'power_check'},
    ]
  },

  complaint_mini:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'Mini-split / ductless system. What are they describing?',
    type:'choice',
    answers:[
      {label:'Not cooling',           sub:'Running but not conditioning',               style:'',    next:'power_check'},
      {label:'Not heating',           sub:'In heat mode, not producing heat',           style:'',    next:'power_check'},
      {label:'Not running at all',    sub:'No response from indoor or outdoor unit',    style:'',    next:'power_check'},
      {label:'Error code on display', sub:'E1, E2, F code or other fault on head unit', style:'', next:'power_check'},
      {label:'Short cycling',         sub:'Starts then shuts off quickly',              style:'',    next:'power_check'},
      {label:'Making a noise',        sub:'Rattling, squealing, gurgling sounds',       style:'',    next:'power_check'},
      {label:'Leaking water',         sub:'Water dripping from indoor head unit',       style:'',    next:'power_check'},
      {label:'Running but not cooling enough', sub:'Runs continuously, can\'t keep up', style:'',   next:'power_check'},
      {label:'Remote / controls not working',  sub:'Unit not responding to remote',     style:'',   next:'power_check'},
    ]
  },

  complaint_ref:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'Commercial refrigeration — what are they describing?',
    type:'choice',
    answers:[
      {label:'Box temp too high',           sub:'Not maintaining setpoint temperature',      style:'', next:'power_check'},
      {label:'Not running at all',           sub:'Unit completely off, no response',          style:'',    next:'power_check'},
      {label:'Compressor short cycling',     sub:'Starts and stops frequently',              style:'',    next:'power_check'},
      {label:'Ice on evaporator coil',       sub:'Evap coil frozen solid',                   style:'', next:'power_check'},
      {label:'Defrost not working',          sub:'Ice building up, not clearing',             style:'',    next:'power_check'},
      {label:'Making a noise',               sub:'Unusual sounds from compressor or fans',   style:'',    next:'power_check'},
      {label:'Leaking water',                sub:'Water on floor, drain issue',              style:'',    next:'power_check'},
      {label:'Display or alarm showing',     sub:'Controller fault or temperature alarm',    style:'', next:'power_check'},
      {label:'Running constantly',           sub:'Never cycles off, high energy use',        style:'',    next:'power_check'},
      {label:'Doors not sealing',            sub:'Gaskets worn, doors not closing properly', style:'',    next:'power_check'},
    ]
  },

  complaint_ahu:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'Air handler / fan coil unit — no refrigerant circuit here, air side and electrical only. What are they describing?',
    type:'choice',
    answers:[
      {label:'No airflow',              sub:'Blower not running or very weak airflow',     style:'',    next:'power_check'},
      {label:'Not cooling / heating',   sub:'Airflow present but not conditioning',        style:'',    next:'power_check'},
      {label:'Not running at all',      sub:'Completely dead',                             style:'',    next:'power_check'},
      {label:'Making a noise',          sub:'Banging, squealing, rattling from blower',    style:'',    next:'power_check'},
      {label:'Tripping breaker',        sub:'Keeps losing power',                          style:'', next:'power_check'},
      {label:'Leaking water',           sub:'Condensate drain backing up or leaking',      style:'',    next:'power_check'},
      {label:'Running but weak output', sub:'Airflow low, not enough conditioning',        style:'',    next:'power_check'},
      {label:'Strange smell',           sub:'Musty, burning, or other odor from unit',    style:'', next:'power_check'},
    ]
  },

  complaint_other:{
    phase:'Customer Intake',phasePip:'grey',
    question:'What is the customer\'s complaint?',
    context:'Unusual or advanced equipment — describe the symptom as best you can.',
    type:'choice',
    answers:[
      {label:'Not cooling',             sub:'System running but no cooling output',       style:'',    next:'power_check'},
      {label:'Not heating',             sub:'System running but no heating output',       style:'',    next:'power_check'},
      {label:'Not running at all',      sub:'Completely dead',                            style:'',    next:'power_check'},
      {label:'Short cycling',           sub:'Starts then shuts off quickly',              style:'',    next:'power_check'},
      {label:'Making a noise',          sub:'Any unusual sound',                          style:'',    next:'power_check'},
      {label:'Tripping breaker',        sub:'Keeps losing power',                         style:'', next:'power_check'},
      {label:'Error / fault code',      sub:'Any fault indication on the unit',           style:'',    next:'power_check'},
      {label:'Leaking — water or refrigerant', sub:'Any fluid leak',                     style:'', next:'power_check'},
      {label:'Not performing',          sub:'Running but not meeting setpoint',           style:'',    next:'power_check'},
    ]
  },

  power_check:{
    phase:'Phase 1 — Controls',phasePip:'grey',
    question:'Do you have power to the system?',
    context:'Before anything else — is the system getting power at all? Check the disconnect, breaker, and that the unit is energized.',
    tip:'<strong>Field note:</strong> Don\'t skip this. A surprisingly high number of calls end here — tripped breaker, pulled disconnect, someone switched it off.',
    type:'yn',
    yes:'thermostat_check',
    no:'no_power',
    unsure:'no_power'
  },

  no_power:{
    phase:'Phase 1 — Controls',phasePip:'red',
    question:'Where is power lost?',
    context:'Trace power backwards from the unit.',
    type:'choice',
    answers:[
      {label:'Breaker tripped at panel',sub:'Reset and monitor — check amp draw if it trips again',style:'warn',next:'breaker_tripped'},
      {label:'Disconnect pulled or open',sub:'Fused or non-fused disconnect at the unit',style:'',next:'disconnect_open'},
      {label:'No power at all — breaker looks fine',sub:'Breaker on but unit still dead',style:'',next:'no_power_breaker_ok'},
      {label:'Blown fuse in disconnect',sub:'Fused disconnect — fuse is open',style:'warn',next:'blown_fuse'},
    ]
  },

  breaker_tripped:{
    phase:'Phase 1 — Controls',phasePip:'red',
    question:'Did the breaker trip hard or is it just off?',
    context:'A breaker that tripped on overcurrent will be in a middle position. One that was manually turned off will be fully off.',
    type:'yn',
    yes:'breaker_reset',
    no:'breaker_manual_off',
    unsure:'breaker_reset'
  },

  breaker_reset:{
    phase:'Phase 1 — Controls',phasePip:'yellow',
    question:'After resetting — does it hold or trip again immediately?',
    context:'Reset the breaker and attempt to start the system. Watch amp draw if possible.',
    type:'choice',
    answers:[
      {label:'Holds — system comes on',sub:'Continue diagnostic — may be a one-time event',style:'yes',next:'thermostat_check'},
      {label:'Trips again immediately',sub:'Hard fault — compressor locked, short to ground, wiring issue',style:'warn',next:'hard_fault_electrical'},
      {label:'Holds but trips after a few minutes',sub:'Thermal overload — overamping under load',style:'warn',next:'thermal_trip'},
    ]
  },

  blown_fuse:{
    phase:'Phase 1 — Controls',phasePip:'red',
    question:'Replace the fuse — does it hold or blow again?',
    context:'Use the correct amp rating. If it blows again immediately there is a hard fault downstream.',
    tip:'<strong>Field note:</strong> Always check why the fuse blew before replacing. A blown fuse is a symptom, not the problem.',
    type:'yn',
    yes:'thermostat_check',
    no:'hard_fault_electrical',
    unsure:'hard_fault_electrical'
  },

  disconnect_open:{
    phase:'Phase 1 — Controls',phasePip:'grey',
    question:'Close the disconnect — does the system power up?',
    context:'Someone may have pulled it for service and not replaced it, or the handle worked loose.',
    type:'yn',
    yes:'thermostat_check',
    no:'no_power_breaker_ok',
    unsure:'no_power_breaker_ok'
  },

  no_power_breaker_ok:{
    phase:'Phase 1 — Controls',phasePip:'red',
    question:'Do you have 24V at the control board or air handler?',
    context:'Check secondary side of the transformer — 24VAC between R and C.',
    tip:'<strong>Field note:</strong> A dead transformer is more common than people think — especially on older equipment or after a lightning event.',
    type:'yn',
    yes:'thermostat_check',
    no:'transformer_issue',
    unsure:'transformer_issue'
  },

  transformer_issue:{
    phase:'Phase 1 — Controls',phasePip:'red',
    type:'outcome',
    title:'Likely: Transformer or low-voltage wiring issue',
    icon:'⚡',
    finding:'No 24V at the control board with line voltage present suggests a failed transformer, blown low-voltage fuse, or a short in the low-voltage wiring.',
    safety:null,
    steps:[
      'Check for a low-voltage fuse on the control board (usually 3A or 5A)',
      'Check transformer primary and secondary with a meter',
      'If transformer reads line voltage on primary but no secondary — replace transformer',
      'If transformer is good — trace low-voltage wiring for a short (thermostat wire stapled too tight, wire pinched in door)',
      'If fuse keeps blowing — there is a short somewhere in the low-voltage circuit'
    ],
    tools:['Multimeter','Replacement transformer (if needed)','Low-voltage fuse (3A or 5A)']
  },

  hard_fault_electrical:{
    phase:'Phase 1 — Controls',phasePip:'red',
    type:'outcome',
    title:'Hard electrical fault',
    icon:'⚡',
    finding:'Breaker trips or fuse blows immediately on reset indicates a hard fault — compressor winding short, contactor welded, or wiring short to ground.',
    safety:'Disconnect power before opening any panels. A hard fault can indicate a compressor with a shorted winding — do not continue to attempt starting until the fault is isolated.',
    steps:[
      'With power off — check compressor winding resistance (common to run, common to start, run to start)',
      'Check for short to ground on compressor terminals',
      'Inspect contactor for welded contacts or burn marks',
      'Check all wiring for signs of burning, chafing, or rodent damage',
      'If compressor is shorted to ground — compressor replacement needed'
    ],
    tools:['Multimeter (ohms)','Megohmmeter if available']
  },

  thermal_trip:{
    phase:'Phase 1 — Controls',phasePip:'yellow',
    type:'outcome',
    title:'Thermal overload — overamping under load',
    icon:'⚡',
    finding:'Breaker holds on startup but trips after running a few minutes indicates the system is drawing excessive amperage under load — compressor overamping, capacitor issue, or refrigerant problem causing high head pressure.',
    safety:null,
    steps:[
      'Check capacitor — a weak capacitor causes higher amp draw at startup and under load',
      'Check amp draw on compressor vs nameplate RLA',
      'Check refrigerant charge — overcharge causes high head pressure and overamping',
      'Check condenser coil cleanliness — dirty coil = high head pressure = high amps',
      'If all above check out — compressor may be mechanically failing'
    ],
    tools:['Clamp meter','Capacitor tester','Manifold gauges']
  },

  breaker_manual_off:{
    phase:'Phase 1 — Controls',phasePip:'grey',
    type:'outcome',
    title:'Breaker was manually turned off',
    icon:'💡',
    finding:'Breaker was switched off intentionally — someone shut the system down.',
    safety:null,
    steps:[
      'Confirm with customer whether they or someone else turned it off',
      'Check for any obvious reason it was shut down (smell, noise, water)',
      'Reset breaker and continue diagnostic'
    ],
    tools:[]
  },

  thermostat_check:{
    phase:'Phase 1 — Controls',phasePip:'grey',
    question:'Is the thermostat on and calling for the right mode?',
    context:'Verify the stat is set to the correct mode — cooling, heating, fan — and the setpoint is actually calling. This sounds obvious but it ends a lot of calls.',
    tip:'<strong>Field note:</strong> Check mode, setpoint, and that the system setting matches what the customer is complaining about. A stat left in "heat" mode on a hot day explains a no-cooling call immediately.',
    type:'yn',
    yes:'stat_wiring',
    no:'thermostat_not_calling',
    unsure:'stat_wiring'
  },

  thermostat_not_calling:{
    phase:'Phase 1 — Controls',phasePip:'yellow',
    question:'Why is the thermostat not calling?',
    context:'Determine if this is a settings issue or an actual thermostat problem.',
    type:'choice',
    answers:[
      {label:'Wrong mode or setpoint — easy fix',sub:'Customer had it set wrong',style:'yes',next:'stat_wiring'},
      {label:'Thermostat has no display or is dead',sub:'Blank screen, no backlight',style:'warn',next:'stat_dead'},
      {label:'Stat is on but system not responding',sub:'Calling but nothing happening',style:'',next:'stat_wiring'},
      {label:'Thermostat was recently replaced or installed',sub:'New stat, may be wired wrong',style:'warn',next:'stat_wiring'},
    ]
  },

  stat_dead:{
    phase:'Phase 1 — Controls',phasePip:'red',
    question:'Does the thermostat have power?',
    context:'Check for 24V between R and C at the thermostat base. Some stats run on batteries — check those first.',
    tip:'<strong>Field note:</strong> Always check batteries on battery-powered stats before anything else. Also check the C-wire — a missing C-wire will kill a smart thermostat.',
    type:'yn',
    yes:'stat_wiring',
    no:'transformer_issue',
    unsure:'transformer_issue'
  },

  stat_wiring:{
    phase:'Phase 1 — Controls',phasePip:'yellow',
    question:'Is the thermostat wired correctly for this system?',
    context:'Check wiring against the system type. Heat pumps need O/B wire. Two-stage systems need Y2/W2. Smart stats need a C-wire.',
    tip:'<strong>Field note:</strong> A Nest or Ecobee installed by a homeowner with no C-wire and a bad power steal setup causes more no-start calls than almost anything else.',
    type:'choice',
    answers:[
      {label:'Wiring looks correct',sub:'Matches system type and stat requirements',style:'yes',next:'system_communication'},
      {label:'Missing C-wire',sub:'Smart thermostat without common wire',style:'warn',next:'missing_c_wire'},
      {label:'Wrong wiring for system type',sub:'Heat pump wired as straight cool, etc.',style:'warn',next:'wrong_wiring'},
      {label:'Wires look burnt or corroded at terminals',sub:'Visible damage at stat base',style:'warn',next:'wiring_damage'},
    ]
  },

  missing_c_wire:{
    phase:'Phase 1 — Controls',phasePip:'yellow',
    type:'outcome',
    title:'Missing C-wire causing control issues',
    icon:'🔌',
    finding:'Smart thermostat installed without a common wire. The thermostat is power-stealing from the R wire through the heating or cooling circuit, causing erratic behavior, dead display, or short cycling.',
    safety:null,
    steps:[
      'Check if there is an unused wire in the thermostat bundle that can be used as C',
      'At the air handler or furnace — connect that wire to the C terminal on the control board',
      'At the stat — connect it to the C terminal',
      'If no spare wire — install a C-wire adapter kit (Venstar Add-A-Wire or similar)',
      'Alternatively — run new thermostat wire'
    ],
    tools:['Multimeter','C-wire adapter kit if needed']
  },

  wrong_wiring:{
    phase:'Phase 1 — Controls',phasePip:'yellow',
    type:'outcome',
    title:'Thermostat wired incorrectly for system type',
    icon:'🔌',
    finding:'The thermostat wiring does not match the system type. Common issues: heat pump O/B reversing valve wire missing or on wrong terminal, two-stage system with only single-stage wiring, or cooling-only stat on a heat pump.',
    safety:null,
    steps:[
      'Photograph existing wiring before changing anything',
      'Reference the equipment wiring diagram — usually inside the panel cover',
      'Verify thermostat is compatible with the system type',
      'Correct wiring per the equipment diagram',
      'For heat pumps — verify O/B wire is present and configured correctly (O for Carrier/Trane, B for some others)'
    ],
    tools:['Phone camera (photo before changing anything)','Wiring diagram']
  },

  wiring_damage:{
    phase:'Phase 1 — Controls',phasePip:'red',
    type:'outcome',
    title:'Damaged wiring at thermostat',
    icon:'⚡',
    finding:'Burnt or corroded wiring at the thermostat terminals. This can cause intermittent faults, failed calls, or a blown low-voltage fuse.',
    safety:'Check for the source of the burn — arcing at terminals can indicate a wiring short. Check the low-voltage fuse on the control board.',
    steps:[
      'Check low-voltage fuse on control board — replace if blown',
      'Clean corroded terminals or replace thermostat base if burnt',
      'Trace wiring back to control board for any damage along the run',
      'Check for staples or pinches in the wire that may have caused a short'
    ],
    tools:['Multimeter','Replacement thermostat base or wire']
  },

  system_communication:{
    phase:'Phase 1 — Controls',phasePip:'grey',
    question:'Is the system responding to the thermostat call?',
    context:'When the stat calls — does anything happen? Listen for contactor pull-in, blower start, ignition attempt.',
    tip:'<strong>Field note:</strong> Stand at the equipment when someone changes the stat setting. What you hear in the first 5 seconds tells you a lot.',
    type:'choice',
    answers:[
      {label:'Yes — equipment responds normally',sub:'System starts, moves to performance issues',style:'yes',next:'visual_assessment'},
      {label:'Indoor unit responds, outdoor does not',sub:'Blower runs but condenser/compressor silent',style:'',next:'outdoor_not_responding'},
      {label:'Nothing responds at all',sub:'Completely silent on call',style:'warn',next:'no_response_on_call'},
      {label:'Partial — something starts then stops',sub:'Short cycling on call',style:'warn',next:'short_cycle_on_call'},
      {label:'Error code or fault light',sub:'Board or equipment showing a fault',style:'warn',next:'fault_code'},
    ]
  },

  no_response_on_call:{
    phase:'Phase 1 — Controls',phasePip:'red',
    question:'Do you have 24V at the equipment on a call?',
    context:'With the stat calling — check for 24V at the Y terminal (cooling) or W terminal (heating) at the control board.',
    tip:'<strong>Field note:</strong> If you have 24V at the stat but not at the equipment — you have a wiring break between the stat and the unit.',
    type:'yn',
    yes:'control_board_issue',
    no:'low_voltage_wiring_break',
    unsure:'low_voltage_wiring_break'
  },

  low_voltage_wiring_break:{
    phase:'Phase 1 — Controls',phasePip:'red',
    type:'outcome',
    title:'Low-voltage wiring break between stat and equipment',
    icon:'🔌',
    finding:'24V present at thermostat but not reaching the equipment control board. Broken wire, corroded connection, or a splice that has failed in the wire run.',
    safety:null,
    steps:[
      'Trace thermostat wire run from stat to equipment',
      'Check all junction points and splices — especially in attics where wire can get damaged',
      'Use a multimeter to ring out each wire conductor',
      'Check for staples through the wire (common in older installs)',
      'Replace wire run if break cannot be located — new 18/5 or 18/8 thermostat wire'
    ],
    tools:['Multimeter','Replacement thermostat wire']
  },

  control_board_issue:{
    phase:'Phase 1 — Controls',phasePip:'red',
    type:'outcome',
    title:'Control board not responding to 24V call',
    icon:'⚡',
    finding:'24V signal is reaching the control board but the board is not responding. Possible failed control board, blown board fuse, or a safety lockout (pressure switch, limit switch, rollout switch).',
    safety:null,
    steps:[
      'Check all safety switches — high pressure, low pressure, limit switches, rollout switches',
      'Check for a tripped manual reset safety (rollout switch on furnaces)',
      'Check board fuses — usually 3A or 5A blade fuse on the board',
      'Look for any LED fault codes on the control board',
      'If all safeties are closed and fuse is good — control board may need replacement'
    ],
    tools:['Multimeter','Jumper wire for safety switch testing (careful)']
  },

  fault_code:{
    phase:'Phase 1 — Controls',phasePip:'yellow',
    type:'outcome',
    title:'Equipment fault code — look it up',
    icon:'⚠',
    finding:'The system is showing a fault code or the control board LED is flashing a sequence. This is the equipment telling you exactly where to look.',
    safety:null,
    steps:[
      'Read the fault code — count LED flashes or read the display',
      'Check the fault code legend — usually on a sticker inside the panel cover',
      'Document the code and look it up in the service manual for that equipment',
      'Common codes: pressure switch faults (check refrigerant charge and coil), limit trips (check airflow), ignition faults (check igniter, flame sensor, gas pressure)',
      'Note: some boards store fault history — check for previous codes too'
    ],
    tools:['Phone camera (photograph the fault code legend)','Service manual']
  },

  outdoor_not_responding:{
    phase:'Phase 2 — Equipment',phasePip:'grey',
    question:'Do you have 24V at the contactor coil on a call?',
    context:'Check for 24V between the two small terminals on the contactor with the stat calling for cooling.',
    tip:'<strong>Field note:</strong> If you have voltage at the coil but contactor isn\'t pulling in — contactor is bad. No voltage means the signal isn\'t making it out there.',
    type:'yn',
    yes:'contactor_check',
    no:'outdoor_no_signal',
    unsure:'contactor_check'
  },

  outdoor_no_signal:{
    phase:'Phase 2 — Equipment',phasePip:'red',
    type:'outcome',
    title:'No 24V signal reaching outdoor unit',
    icon:'🔌',
    finding:'Indoor unit is running but 24V is not making it to the outdoor contactor. Check the low-voltage wiring between indoor and outdoor units, and verify the high-pressure and low-pressure switch circuits are closed.',
    safety:null,
    steps:[
      'Check high-pressure switch and low-pressure switch — both should be closed (continuity) under normal conditions',
      'A tripped low-pressure switch suggests low refrigerant charge',
      'A tripped high-pressure switch suggests high head pressure — dirty coil, blocked airflow, overcharge',
      'Check the low-voltage wire run between indoor and outdoor unit',
      'Verify terminals at both ends are tight and not corroded'
    ],
    tools:['Multimeter','Manifold gauges']
  },

  contactor_check:{
    phase:'Phase 2 — Equipment',phasePip:'grey',
    question:'Is the contactor pulling in?',
    context:'With 24V at the coil — does the contactor close? You should hear a click and the contacts should pull together.',
    type:'yn',
    yes:'visual_assessment',
    no:'contactor_bad',
    unsure:'contactor_bad'
  },

  contactor_bad:{
    phase:'Phase 2 — Equipment',phasePip:'yellow',
    type:'outcome',
    title:'Failed contactor',
    icon:'⚡',
    finding:'24V present at contactor coil but contactor is not pulling in. Coil is open, contacts are pitted and stuck, or contactor is mechanically failed.',
    safety:'Always discharge capacitors before working near the contactor. Use an insulated screwdriver if manually depressing the contactor for testing.',
    steps:[
      'Check coil resistance — should read 8-30 ohms depending on manufacturer',
      'Open coil (OL on meter) = replace contactor',
      'If coil reads correctly but won\'t pull in — contacts may be mechanically seized',
      'Inspect contacts for severe pitting or burning — replace if contact surface is more than 50% worn',
      'Replace contactor — they are inexpensive and a common wear item'
    ],
    tools:['Multimeter','Replacement contactor (match voltage and amp rating)']
  },

  short_cycle_on_call:{
    phase:'Phase 2 — Equipment',phasePip:'yellow',
    question:'How quickly does it shut off after starting?',
    context:'Timing the shutdown helps narrow down which safety is tripping.',
    type:'choice',
    answers:[
      {label:'Under 5 seconds',sub:'Almost immediately — pressure or electrical fault',style:'warn',next:'immediate_trip'},
      {label:'30 seconds to 2 minutes',sub:'Runs briefly — thermal or pressure issue',style:'warn',next:'short_run_trip'},
      {label:'Several minutes',sub:'Gets through startup, trips under load',style:'',next:'thermal_trip'},
      {label:'Furnace — lights then shuts off',sub:'Ignites but flame goes out',style:'warn',next:'furnace_short_cycle'},
    ]
  },

  immediate_trip:{
    phase:'Phase 2 — Equipment',phasePip:'red',
    type:'outcome',
    title:'Immediate trip on startup — hard fault',
    icon:'⚡',
    finding:'System shutting down in under 5 seconds indicates a hard fault — high pressure trip, low pressure trip, compressor protection, or electrical fault.',
    safety:null,
    steps:[
      'Check high-pressure switch — if tripping immediately, check for blocked condenser coil or refrigerant overcharge',
      'Check low-pressure switch — if tripping immediately, system may be very low on refrigerant',
      'Check for fault code on control board — it usually records the reason for shutdown',
      'Check compressor amp draw on startup — if extremely high, compressor may be seized',
      'If compressor hums but doesn\'t start — capacitor or compressor issue'
    ],
    tools:['Manifold gauges','Clamp meter','Multimeter']
  },

  furnace_short_cycle:{
    phase:'Phase 2 — Equipment',phasePip:'yellow',
    question:'Does the burner light at all before shutting down?',
    context:'Watch through the sight glass or observation port on the heat exchanger.',
    type:'yn',
    yes:'furnace_lights_then_out',
    no:'furnace_no_ignition',
    unsure:'furnace_no_ignition'
  },

  furnace_no_ignition:{
    phase:'Phase 2 — Equipment',phasePip:'red',
    type:'outcome',
    title:'Furnace not igniting',
    icon:'🔥',
    finding:'Furnace going through ignition sequence but flame never establishes. Common causes: failed igniter, gas valve not opening, low gas pressure, or flame sensor issue.',
    safety:'Confirm gas supply is on and at correct pressure before condemning components. Never attempt to manually light a furnace that uses an electronic ignition system.',
    steps:[
      'Watch igniter on startup — does it glow orange/red? (hot surface igniter) Does it spark? (spark ignition)',
      'No glow = check igniter resistance (should be 40-90 ohms on most igniters — open = bad)',
      'Igniter glows but no flame = gas valve not opening or no gas pressure',
      'Check gas pressure — static and manifold',
      'Check for 24V at gas valve on call — no voltage means board or wiring issue, voltage present means gas valve may be failed'
    ],
    tools:['Multimeter','Manometer for gas pressure']
  },

  furnace_lights_then_out:{
    phase:'Phase 2 — Equipment',phasePip:'yellow',
    type:'outcome',
    title:'Furnace lights then flame goes out',
    icon:'🔥',
    finding:'Flame establishes briefly then shuts down. Most common cause is a dirty or failed flame sensor. The flame sensor rod must be clean to pass enough microamps to prove flame to the control board.',
    safety:null,
    steps:[
      'Locate flame sensor — usually a single rod with a white ceramic insulator in the burner flame path',
      'Pull the sensor — check the rod for heavy white oxide buildup',
      'Clean with fine steel wool or emery cloth until the rod is bright metal',
      'Check microamp reading with a meter capable of DC microamps — should read 1.5-4 microamps minimum in flame',
      'Under 1 microamp = clean or replace sensor',
      'Also check: is the flame actually engulfing the sensor rod? A lazy flame from low gas pressure may not reach it'
    ],
    tools:['Multimeter with microamp range','Fine steel wool or emery cloth']
  },

  short_run_trip:{
    phase:'Phase 2 — Equipment',phasePip:'yellow',
    type:'outcome',
    title:'Trips after short run — pressure or thermal fault',
    icon:'⚠',
    finding:'Running 30 seconds to 2 minutes before shutting down suggests a pressure switch trip or thermal protection. The system is getting to operating conditions and then something is out of range.',
    safety:null,
    steps:[
      'Connect gauges and watch pressures on startup',
      'High-side climbing rapidly and tripping = dirty condenser coil, blocked airflow, refrigerant overcharge',
      'Low-side dropping to vacuum and tripping = low refrigerant charge or severe airflow restriction on indoor',
      'Check condenser fan — is it running? A failed condenser fan will cause head pressure to spike within minutes',
      'Check indoor coil and filter for restriction — blocked evap will cause low suction and high superheat'
    ],
    tools:['Manifold gauges','Clamp meter']
  },

  visual_assessment:{
    phase:'Phase 2 — Visual',phasePip:'grey',
    question:'What is the overall condition of the equipment?',
    context:'Before pulling out gauges — what does the system look like? Condition tells you what you\'re dealing with before you measure anything.',
    tip:'<strong>Field note:</strong> A system that\'s never been cleaned tells you a lot. High superheat and low airflow on a dirty system is usually a coil issue, not a charge issue. Don\'t add refrigerant to a dirty system.',
    type:'choice',
    answers:[
      {label:'Clean — looks maintained',sub:'Coils look good, filter is clean, no obvious issues',style:'yes',next:'performance_check'},
      {label:'Dirty but functional',sub:'Needs cleaning but system appears intact',style:'warn',next:'dirty_system'},
      {label:'Heavily fouled — coils completely blocked',sub:'Can barely see the coil fins',style:'warn',next:'heavily_fouled'},
      {label:'Obvious physical damage',sub:'Bent coils, burnt wires, oil stains, ice',style:'warn',next:'physical_damage'},
      {label:'Never been cleaned — significant buildup',sub:'Years of dirt and debris',style:'warn',next:'dirty_system'},
    ]
  },

  dirty_system:{
    phase:'Phase 2 — Visual',phasePip:'yellow',
    type:'outcome',
    title:'Dirty system — clean before diagnosing refrigerant',
    icon:'🧹',
    finding:'System has significant dirt buildup that will affect performance readings. A dirty condenser coil causes high head pressure and high discharge temps. A dirty evaporator causes low airflow, high superheat, and can mimic low charge.',
    safety:null,
    steps:[
      'Clean condenser coil — rinse from inside out with low pressure water',
      'Check and replace filter if dirty',
      'If evaporator coil is accessible — inspect for dirt buildup',
      'After cleaning — allow system to run 15-20 minutes before taking refrigerant readings',
      'Re-evaluate symptoms after cleaning — many performance issues resolve with cleaning alone'
    ],
    tools:['Coil cleaner','Garden hose / low pressure water','Replacement filter']
  },

  heavily_fouled:{
    phase:'Phase 2 — Visual',phasePip:'red',
    type:'outcome',
    title:'Heavily fouled — cleaning required before any other diagnosis',
    icon:'🧹',
    finding:'Coils are completely blocked. Any refrigerant readings taken now are meaningless — the system cannot operate normally with zero airflow through the coils. Do not add refrigerant to a system in this condition.',
    safety:null,
    steps:[
      'Clean condenser coil thoroughly — may require commercial coil cleaner and significant rinsing',
      'Check evaporator coil — likely also dirty if condenser is this bad',
      'Replace filter',
      'Clean condenser fan blades',
      'Run system for 20-30 minutes after cleaning before evaluating performance',
      'Educate customer on maintenance schedule — twice yearly cleaning minimum'
    ],
    tools:['Nu-Brite or similar coil cleaner','Garden hose','Fin comb if fins are bent']
  },

  physical_damage:{
    phase:'Phase 2 — Visual',phasePip:'red',
    question:'What damage do you see?',
    context:'Document everything you find. Physical damage changes the diagnostic path significantly.',
    type:'choice',
    answers:[
      {label:'Oil stains on refrigerant lines or coil',sub:'Refrigerant leak with oil migration',style:'warn',next:'refrigerant_leak'},
      {label:'Ice on suction line or evaporator coil',sub:'System frozen up',style:'warn',next:'system_iced'},
      {label:'Burnt wires or electrical damage',sub:'Visible burn marks, melted insulation',style:'warn',next:'electrical_damage'},
      {label:'Bent or crushed coil fins',sub:'Physical impact damage to coil',style:'',next:'physical_coil_damage'},
      {label:'Water damage or flooding',sub:'Unit was submerged or heavily wet',style:'warn',next:'water_damage'},
    ]
  },

  refrigerant_leak:{
    phase:'Phase 2 — Visual',phasePip:'red',
    type:'outcome',
    title:'Refrigerant leak — locate before recharging',
    icon:'💧',
    finding:'Oil staining indicates a refrigerant leak. Refrigerant carries oil with it when it leaks — where you see oil, you\'ll find the leak. Do not add refrigerant without locating and repairing the leak first.',
    safety:'R-410A and R-22 are not flammable but discharge in an enclosed space can displace oxygen. Ensure adequate ventilation when working with refrigerants.',
    steps:[
      'Inspect around the oil stain closely — look for a crack, pitted joint, or failed Schrader valve',
      'Check all flare fittings and brazed joints on the lineset',
      'Check service valve cores — a leaking core will show oil around the cap',
      'Use an electronic leak detector — move slowly around all joints and the coil',
      'Repair the leak before adding any refrigerant',
      'After repair — pressure test with nitrogen before recharging'
    ],
    tools:['Electronic leak detector','UV light and dye (if dye already in system)','Nitrogen for pressure testing']
  },

  system_iced:{
    phase:'Phase 2 — Visual',phasePip:'yellow',
    type:'outcome',
    title:'System iced up — defrost before diagnosing',
    icon:'🧊',
    finding:'Ice on the suction line or evaporator indicates the system has been running with restricted airflow or very low refrigerant charge. You cannot take accurate readings until the ice is melted.',
    safety:null,
    steps:[
      'Shut system off and run fan only to defrost — or turn power off completely',
      'Do not chip ice — let it melt naturally or use low heat',
      'While defrosting — check filter (likely blocked) and evaporator coil condition',
      'After defrost — identify the cause: low airflow (dirty filter/coil) or low charge (gauge it)',
      'A system with good airflow that still ices has a charge issue — check superheat'
    ],
    tools:['Manifold gauges (after defrost)','Replacement filter']
  },

  electrical_damage:{
    phase:'Phase 2 — Visual',phasePip:'red',
    type:'outcome',
    title:'Electrical damage — inspect thoroughly before powering',
    icon:'⚡',
    finding:'Burnt wires or melted insulation indicate an electrical fault — possibly a loose connection that arced, a failed component that overheated, or a lightning/surge event.',
    safety:'Do not restore power until all damaged wiring is replaced. Arced or damaged wiring is a fire hazard.',
    steps:[
      'Photograph all damage before touching anything',
      'Trace the damage to its source — where did it start?',
      'Check contactor contacts — pitted or welded contacts cause overheating',
      'Check capacitor — a bulging or leaking capacitor can cause downstream electrical damage',
      'Replace all damaged wiring — do not tape and leave burnt wire in place',
      'Check for a surge protector — recommend one if not present'
    ],
    tools:['Multimeter','Replacement wire','Wire crimps or terminals']
  },

  physical_coil_damage:{
    phase:'Phase 2 — Visual',phasePip:'yellow',
    type:'outcome',
    title:'Physical coil damage',
    icon:'⚠',
    finding:'Bent or crushed coil fins restrict airflow through the coil, causing high head pressure and reduced efficiency. Severe damage can also cause refrigerant leaks at the coil.',
    safety:null,
    steps:[
      'Assess severity — minor fin damage is normal, major crushing reduces airflow significantly',
      'Use a fin comb to straighten bent fins if accessible',
      'Check for refrigerant leaks in the damaged area with a leak detector',
      'If damage is severe enough to restrict airflow significantly — coil replacement may be needed',
      'Protect the unit from future physical damage (install a coil guard if in a vulnerable location)'
    ],
    tools:['Fin comb','Leak detector']
  },

  water_damage:{
    phase:'Phase 2 — Visual',phasePip:'red',
    type:'outcome',
    title:'Water damage — electrical inspection required',
    icon:'💧',
    finding:'Equipment that has been submerged or heavily wet requires full electrical inspection before energizing. Water in electrical components causes corrosion, shorts, and failure.',
    safety:'Do not energize a unit that has been flooded without a full inspection. Water in a compressor or motor causes immediate failure on startup.',
    steps:[
      'Do not power on until fully dried and inspected',
      'Open all panels — inspect for standing water, rust, corrosion',
      'Check contactor, capacitor, control board for water damage',
      'Check compressor — if water entered the compressor, it will need replacement',
      'Dry with compressed air or allow to air dry completely',
      'Check motor windings for ground fault before energizing',
      'Document everything — this may be an insurance claim'
    ],
    tools:['Multimeter (megohmmeter preferred)','Compressed air']
  },

  performance_check:{
    phase:'Phase 3 — Performance',phasePip:'grey',
    question:'Now pull out your instruments. What do your pressures look like?',
    context:'System is running, equipment looks ok — time to measure. Connect gauges and let the system stabilize for at least 5 minutes before reading.',
    tip:'<strong>Field note:</strong> Always let the system run 10-15 minutes before trusting gauge readings. A system that just started hasn\'t reached steady state.',
    type:'choice',
    answers:[
      {label:'Pressures look normal for conditions',sub:'Suction and head pressure in expected range',style:'yes',next:'check_airflow'},
      {label:'Low suction pressure',sub:'Suction lower than expected',style:'warn',next:'low_suction'},
      {label:'High head pressure',sub:'Head pressure elevated',style:'warn',next:'high_head'},
      {label:'Both high and low are off',sub:'Pressures don\'t make sense together',style:'warn',next:'pressures_both_off'},
      {label:'No pressure — system pulled into vacuum',sub:'Suction reading 0 or negative',style:'warn',next:'system_in_vacuum'},
    ]
  },

  low_suction:{
    phase:'Phase 3 — Performance',phasePip:'yellow',
    type:'outcome',
    title:'Low suction pressure',
    icon:'📊',
    finding:'Low suction pressure indicates restricted refrigerant flow or insufficient heat load on the evaporator. Most common causes: low refrigerant charge, restricted metering device (TXV stuck closed or orifice clogged), or severely restricted airflow across the evaporator.',
    safety:null,
    steps:[
      'Check superheat first — high superheat + low suction = low charge or TXV issue',
      'Low superheat + low suction = TXV flooding or very low airflow',
      'Check filter and evaporator coil condition — restricted airflow kills suction pressure',
      'If superheat is high and airflow is good — system is likely low on charge or TXV is restricted',
      'Check subcooling at liquid line — low subcooling confirms low charge',
      'Locate and repair any leak before adding refrigerant'
    ],
    tools:['Manifold gauges','Clamp temp probes for superheat/subcooling']
  },

  high_head:{
    phase:'Phase 3 — Performance',phasePip:'yellow',
    type:'outcome',
    title:'High head pressure',
    icon:'📊',
    finding:'Elevated head pressure indicates a heat rejection problem at the condenser. Most common causes: dirty condenser coil, failed or slow condenser fan, refrigerant overcharge, or non-condensables (air) in the system.',
    safety:null,
    steps:[
      'Check condenser fan — is it running at full speed? A slow or failed fan is the most common cause',
      'Check condenser coil — dirty coil restricts airflow and causes high head',
      'Check subcooling — high subcooling + high head = overcharge',
      'Check outdoor ambient temperature — very high ambient will raise head pressure but should still be within range',
      'If condenser fan and coil are good and charge is correct — check for non-condensables',
      'Verify discharge temperature — should be roughly 50-70°F above condensing temp'
    ],
    tools:['Manifold gauges','Clamp meter (fan motor amps)','Thermometer']
  },

  system_in_vacuum:{
    phase:'Phase 3 — Performance',phasePip:'red',
    type:'outcome',
    title:'System pulled into vacuum — critically low charge',
    icon:'⚠',
    finding:'Suction pressure at or below zero indicates the system is critically low on refrigerant. There is likely a significant leak. Do not continue running the system — compressor damage from running in a vacuum is possible.',
    safety:'Shut the system down. Running a compressor in a vacuum damages the motor windings and can cause compressor failure. Find the leak before adding refrigerant.',
    steps:[
      'Shut system down immediately',
      'Perform leak search — with this little charge remaining there is a significant leak somewhere',
      'Check all service valve cores, flare connections, brazed joints, and coils',
      'Once leak is found and repaired — pressure test with nitrogen to 400 psig (R-410A systems)',
      'Pull vacuum after pressure test — minimum 500 microns',
      'Recharge by weight per nameplate or manufacturer specification'
    ],
    tools:['Electronic leak detector','Nitrogen cylinder','Vacuum pump','Micron gauge','Manifold gauges']
  },

  pressures_both_off:{
    phase:'Phase 3 — Performance',phasePip:'yellow',
    type:'outcome',
    title:'Both pressures abnormal — check the big picture',
    icon:'📊',
    finding:'When both suction and head pressure are off together, the cause is usually systemic — a compressor issue, a severely restricted liquid line, or a reversing valve problem on a heat pump.',
    safety:null,
    steps:[
      'Check compression ratio (head / suction) — normal is roughly 2.5:1 to 4:1 depending on conditions',
      'Very low compression ratio (head and suction close together) suggests compressor not pumping — check compressor valve plates',
      'High head AND high suction together can indicate a stuck open reversing valve (heat pumps)',
      'Check liquid line for restriction — a kinked or blocked liquid line causes high head and low suction together',
      'Check TXV operation — a stuck open TXV floods the evaporator and raises suction while lowering head'
    ],
    tools:['Manifold gauges','Clamp temp probes','Multimeter']
  },

  check_airflow:{
    phase:'Phase 3 — Performance',phasePip:'grey',
    question:'What does your temperature split look like?',
    context:'Measure return air dry bulb and supply air dry bulb. Expected split is 16-22°F on a properly operating system.',
    type:'choice',
    answers:[
      {label:'14–22°F split — normal',sub:'System is cooling properly',style:'yes',next:'outcome_normal'},
      {label:'Under 14°F split',sub:'Not removing enough heat',style:'warn',next:'low_split'},
      {label:'Over 22°F split',sub:'Split too high',style:'warn',next:'high_split'},
      {label:'No split — same temp in and out',sub:'No heat transfer happening',style:'warn',next:'no_split'},
    ]
  },

  low_split:{
    phase:'Phase 3 — Performance',phasePip:'yellow',
    type:'outcome',
    title:'Low temperature split',
    icon:'🌡',
    finding:'Temperature split under 14°F indicates the system is not removing adequate heat from the airstream. Most common causes: low refrigerant charge, dirty evaporator coil, or excessive airflow (blower speed too high).',
    safety:null,
    steps:[
      'Check refrigerant charge — low charge is the most common cause of low split',
      'Check evaporator coil — a dirty coil reduces heat transfer surface',
      'Check blower speed — too much airflow reduces the split (air moves too fast across coil)',
      'Check return air temperature and humidity — low humidity days will show lower splits',
      'Verify the system has reached steady state — check again after 15-20 minutes of runtime'
    ],
    tools:['Manifold gauges','Digital thermometer or thermocouple probes']
  },

  high_split:{
    phase:'Phase 3 — Performance',phasePip:'yellow',
    type:'outcome',
    title:'High temperature split',
    icon:'🌡',
    finding:'Split over 22°F typically indicates restricted airflow — the air is moving too slowly across the coil, picking up too much heat. Most common cause is a dirty filter, restricted ductwork, or low blower speed.',
    safety:null,
    steps:[
      'Check and replace filter — most common cause of high split',
      'Check total external static pressure — high ESP indicates duct restriction or dirty coil',
      'Check blower motor amp draw and speed setting',
      'Inspect evaporator coil for dirt or ice',
      'Check all supply and return registers — any that are closed or blocked?'
    ],
    tools:['Digital manometer for static pressure','Digital thermometer','Replacement filter']
  },

  no_split:{
    phase:'Phase 3 — Performance',phasePip:'red',
    type:'outcome',
    title:'No temperature split — system not transferring heat',
    icon:'🌡',
    finding:'Same temperature in and out means the refrigerant circuit is not absorbing heat from the airstream at all. The system may be running but not conditioning. Most likely causes: severely restricted or iced evaporator, compressor not pumping, or complete loss of refrigerant charge.',
    safety:null,
    steps:[
      'Check for ice on evaporator coil — a completely iced coil blocks all airflow',
      'Check suction and discharge pressures — a compressor not pumping will show near-equal pressures',
      'Check refrigerant charge — if pulled to vacuum there is no refrigerant to absorb heat',
      'Shut down and allow to defrost if iced, then re-evaluate',
      'If pressures are equal on suction and discharge with compressor running — compressor has failed'
    ],
    tools:['Manifold gauges','Thermometer']
  },

  outcome_normal:{
    phase:'Complete',phasePip:'grey',
    type:'outcome',
    title:'System operating normally',
    icon:'✓',
    finding:'Pressures are within range, temperature split is good, no fault codes, equipment is clean and responding correctly. System appears to be operating as designed.',
    safety:null,
    steps:[
      'Document your readings — pressures, temps, split, amp draws',
      'Verify with customer that their complaint is resolved',
      'Check and replace filter if dirty',
      'Note any deferred maintenance — capacitor age, coil condition, belt condition',
      'Recommend a maintenance agreement if not already on one'
    ],
    tools:[]
  },

} as const;

export const ROOT_ID = 'start';
