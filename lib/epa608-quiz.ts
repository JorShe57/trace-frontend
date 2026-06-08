/* Multiple-choice question bank for the EPA Section 608 practice quiz.

   This is deliberately separate from the flashcard deck (lib/epa608.ts): the
   study guide is for learning, this is for self-testing. Each question carries
   its distractors and a short explanation shown after answering. Questions are
   grouped by the same certification sections as the flashcards.

   `answer` must match one of the strings in `options` exactly — the quiz
   component shuffles option order and compares by value, so there is no
   "correct index" to keep in sync. */

import type { EpaSectionId } from '@/lib/epa608';

export type QuizQuestion = {
  section: EpaSectionId;
  q: string;
  options: string[];
  /** Must be one of `options`. */
  answer: string;
  explain: string;
};

export const EPA_QUIZ: QuizQuestion[] = [
  // ---------- Core ----------
  {
    section: 'core',
    q: 'Which atom in CFC and HCFC refrigerants is responsible for destroying stratospheric ozone?',
    options: ['Carbon', 'Chlorine', 'Hydrogen', 'Fluorine'],
    answer: 'Chlorine',
    explain: 'A single chlorine atom can destroy thousands of ozone molecules in a repeating chain reaction.',
  },
  {
    section: 'core',
    q: 'The ozone layer that shields us from UV radiation is located in the:',
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
    answer: 'Stratosphere',
    explain: 'Stratospheric ozone absorbs most of the sun’s harmful ultraviolet radiation.',
  },
  {
    section: 'core',
    q: 'Which international treaty set the schedule for phasing out ozone-depleting substances?',
    options: ['The Kyoto Protocol', 'The Paris Agreement', 'The Montreal Protocol', 'The Geneva Convention'],
    answer: 'The Montreal Protocol',
    explain: 'The Montreal Protocol (1987) is implemented in the U.S. through Title VI / Section 608 of the Clean Air Act.',
  },
  {
    section: 'core',
    q: 'Reprocessing refrigerant to the AHRI 700 new-product purity standard, verified by chemical analysis, is called:',
    options: ['Recovery', 'Recycling', 'Reclaiming', 'Retrofitting'],
    answer: 'Reclaiming',
    explain: 'Only refrigerant reclaimed to AHRI 700 may be sold to a new owner. Recovered or recycled refrigerant may only go back to the same owner’s equipment.',
  },
  {
    section: 'core',
    q: 'A refrigerant recovery cylinder should not be filled beyond what percentage of its volume?',
    options: ['60%', '70%', '80%', '90%'],
    answer: '80%',
    explain: 'The 20% headspace allows the liquid to expand safely as temperature rises, preventing hydrostatic rupture.',
  },
  {
    section: 'core',
    q: 'How long must refrigerant service, sales, and recovery records be retained?',
    options: ['1 year', '2 years', '3 years', '5 years'],
    answer: '3 years',
    explain: 'EPA requires these records be kept for three years.',
  },
  {
    section: 'core',
    q: 'How often must an EPA Section 608 technician certification be renewed?',
    options: ['Every 3 years', 'Every 5 years', 'Every 10 years', 'Never — it is good for life'],
    answer: 'Never — it is good for life',
    explain: 'Section 608 certification does not expire.',
  },
  {
    section: 'core',
    q: 'What does the EPA program acronym SNAP stand for?',
    options: [
      'Safe New Appliance Program',
      'Significant New Alternatives Policy',
      'Standard National Air Protocol',
      'Substitute Numbering And Phaseout',
    ],
    answer: 'Significant New Alternatives Policy',
    explain: 'SNAP reviews and lists acceptable and unacceptable substitute refrigerants and their use conditions.',
  },
  {
    section: 'core',
    q: 'Which gas is appropriate for pressure-testing a system for leaks?',
    options: ['Oxygen', 'Compressed shop air', 'Dry nitrogen', 'Acetylene'],
    answer: 'Dry nitrogen',
    explain: 'Oxygen or air can form an explosive mixture with refrigerant/oil vapor under pressure. Use dry nitrogen (sometimes with a trace of refrigerant).',
  },
  {
    section: 'core',
    q: 'Ozone Depletion Potential (ODP) is measured relative to which reference substance?',
    options: ['CO₂', 'R-22', 'CFC-11', 'R-134a'],
    answer: 'CFC-11',
    explain: 'ODP is referenced to CFC-11 (=1). GWP, by contrast, is referenced to CO₂ (=1).',
  },

  // ---------- Type I ----------
  {
    section: 'type1',
    q: 'A “small appliance” for Type I purposes is factory-sealed and charged with no more than:',
    options: ['3 pounds', '5 pounds', '15 pounds', '20 pounds'],
    answer: '5 pounds',
    explain: 'Small appliances are manufactured, charged, and hermetically sealed at the factory with 5 lb or less of refrigerant.',
  },
  {
    section: 'type1',
    q: 'Using recovery equipment made on/after Nov 15, 1993 on a small appliance with an OPERATING compressor, you must recover at least:',
    options: ['80%', '85%', '90%', '95%'],
    answer: '90%',
    explain: 'With the compressor running, the target is 90%. With a non-operating compressor it drops to 80%.',
  },
  {
    section: 'type1',
    q: 'On a small appliance whose compressor will NOT run, the required recovery level is:',
    options: ['70%', '80%', '90%', '100%'],
    answer: '80%',
    explain: 'A non-operating compressor reduces the achievable recovery, so the requirement is 80%.',
  },
  {
    section: 'type1',
    q: 'System-dependent (passive) recovery equipment may be used on:',
    options: [
      'Any appliance regardless of charge',
      'Only small appliances (5 lb or less)',
      'Only appliances over 50 lb',
      'Only low-pressure chillers',
    ],
    answer: 'Only small appliances (5 lb or less)',
    explain: 'Larger, high-pressure systems require self-contained (active) recovery equipment.',
  },
  {
    section: 'type1',
    q: 'Which of these is a small appliance?',
    options: ['A rooftop package unit', 'A window air conditioner', 'A centrifugal chiller', 'A supermarket refrigeration rack'],
    answer: 'A window air conditioner',
    explain: 'Window ACs, household refrigerators/freezers, dehumidifiers, water coolers, and vending machines are small appliances.',
  },
  {
    section: 'type1',
    q: 'Self-contained (active) recovery equipment differs from system-dependent equipment because it:',
    options: [
      'Relies on the appliance’s own compressor',
      'Has its own pump/compressor and works even if the appliance can’t run',
      'Can only recover vapor, never liquid',
      'Is only legal on systems over 200 lb',
    ],
    answer: 'Has its own pump/compressor and works even if the appliance can’t run',
    explain: 'Active equipment supplies its own means to pull refrigerant out, independent of the appliance.',
  },
  {
    section: 'type1',
    q: 'If a small appliance’s compressor is inoperative, a good way to improve passive recovery is to:',
    options: [
      'Add nitrogen to the system',
      'Gently warm the compressor and recover from both high and low sides',
      'Vent the low side first',
      'Run the recovery machine in reverse',
    ],
    answer: 'Gently warm the compressor and recover from both high and low sides',
    explain: 'Heat raises internal pressure to drive more refrigerant out; tapping both sides and pulling liquid speeds it up.',
  },

  // ---------- Type II ----------
  {
    section: 'type2',
    q: 'A high-pressure refrigerant has a boiling point (at atmospheric pressure) in roughly which range?',
    options: ['Above 10°C', 'Between −50°C and 10°C', 'Below −50°C', 'Exactly 0°C'],
    answer: 'Between −50°C and 10°C',
    explain: 'Examples include R-22, R-410A, R-407C, R-404A, R-134a, and R-502.',
  },
  {
    section: 'type2',
    q: 'Which is a VERY-high-pressure refrigerant that cannot be recovered as a liquid?',
    options: ['R-22', 'R-134a', 'R-13', 'R-410A'],
    answer: 'R-13',
    explain: 'Very-high-pressure refrigerants (e.g., R-13, R-503) boil below about −50°C and must not be put in disposable cylinders.',
  },
  {
    section: 'type2',
    q: 'Which instrument measures the deep vacuum used to verify a system has been properly evacuated?',
    options: ['A manifold gauge set', 'A micron gauge', 'A clamp-on ammeter', 'A sling psychrometer'],
    answer: 'A micron gauge',
    explain: 'A micron (vacuum) gauge reads in microns of mercury; a common service target is around 500 microns.',
  },
  {
    section: 'type2',
    q: 'Non-condensables (air) trapped in a high-pressure system will:',
    options: [
      'Lower the head pressure',
      'Raise head pressure and condensing temperature, hurting efficiency',
      'Have no measurable effect',
      'Improve heat transfer',
    ],
    answer: 'Raise head pressure and condensing temperature, hurting efficiency',
    explain: 'Air also skews pressure-temperature readings and can cause overheating, so it must be evacuated.',
  },
  {
    section: 'type2',
    q: 'The push-pull recovery method is used primarily to:',
    options: [
      'Recover from small sealed appliances',
      'Speed recovery of large LIQUID charges',
      'Remove moisture only',
      'Test for leaks',
    ],
    answer: 'Speed recovery of large LIQUID charges',
    explain: 'Push-pull pushes vapor in to force liquid out into the recovery cylinder — efficient on systems with large charges.',
  },
  {
    section: 'type2',
    q: 'R-410A is classified as which type of refrigerant?',
    options: ['Low-pressure', 'High-pressure', 'Very-high-pressure', 'Non-pressurized'],
    answer: 'High-pressure',
    explain: 'R-410A is a common high-pressure refrigerant serviced under Type II certification.',
  },
  {
    section: 'type2',
    q: 'Why is a deep vacuum pulled before recharging a high-pressure system after repair?',
    options: [
      'To add refrigerant faster',
      'To boil off moisture and remove air/non-condensables',
      'To increase oil viscosity',
      'To raise the head pressure',
    ],
    answer: 'To boil off moisture and remove air/non-condensables',
    explain: 'Moisture left in a system forms acids and can freeze at the metering device.',
  },

  // ---------- Type III ----------
  {
    section: 'type3',
    q: 'Which of these is a low-pressure refrigerant used in centrifugal chillers?',
    options: ['R-410A', 'R-22', 'R-123', 'R-404A'],
    answer: 'R-123',
    explain: 'Low-pressure refrigerants (R-11, R-123, R-113) boil above 10°C and run in a vacuum on the low side.',
  },
  {
    section: 'type3',
    q: 'When leak-testing a low-pressure chiller, you must NOT exceed which pressure?',
    options: ['10 psig', '15 psig', '50 psig', '150 psig'],
    answer: '10 psig',
    explain: 'Use dry nitrogen and stay at or below 10 psig — the vessel and rupture disk are not built for high pressure.',
  },
  {
    section: 'type3',
    q: 'The rupture disk on a low-pressure chiller is typically set to relieve at about:',
    options: ['10 psig', '15 psig', '30 psig', '75 psig'],
    answer: '15 psig',
    explain: 'This is why leak-test pressure is held well below it, at ≤10 psig.',
  },
  {
    section: 'type3',
    q: 'The purge unit on a low-pressure chiller primarily removes:',
    options: ['Excess oil', 'Non-condensables (air and moisture)', 'Excess refrigerant', 'Scale from the tubes'],
    answer: 'Non-condensables (air and moisture)',
    explain: 'Non-condensables collect at the top of the condenser; the purge unit vents them.',
  },
  {
    section: 'type3',
    q: 'A high or frequent purge rate on a low-pressure machine usually indicates:',
    options: ['An overcharge', 'A refrigerant leak (air being drawn in)', 'Low oil level', 'A dirty condenser'],
    answer: 'A refrigerant leak (air being drawn in)',
    explain: 'Because the low side runs in a vacuum, leaks pull air in, which the purge unit then has to remove frequently.',
  },
  {
    section: 'type3',
    q: 'The required recovery level for a low-pressure appliance (equipment made on/after Nov 15, 1993) is about:',
    options: ['4 in. Hg vacuum', '10 in. Hg vacuum', '25 mm Hg absolute', '15 psig'],
    answer: '25 mm Hg absolute',
    explain: 'That is roughly 29.9 in. Hg vacuum. Older equipment must reach about 25 in. Hg vacuum.',
  },
  {
    section: 'type3',
    q: 'Why should water flow be maintained (or closely monitored) in the tubes while evacuating a low-pressure chiller?',
    options: [
      'To speed up recovery',
      'To prevent the water in the tubes from freezing and rupturing them',
      'To cool the recovery machine',
      'To dilute the refrigerant',
    ],
    answer: 'To prevent the water in the tubes from freezing and rupturing them',
    explain: 'Under deep vacuum the boiling refrigerant absorbs heat and can freeze remaining water in the tubes.',
  },
];

/** Quiz questions for a section, or all questions when no section is given. */
export function quizForSection(section?: EpaSectionId): QuizQuestion[] {
  return section ? EPA_QUIZ.filter((q) => q.section === section) : EPA_QUIZ;
}
