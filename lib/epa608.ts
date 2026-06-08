/* Study content for the EPA Section 608 Technician Certification exam.

   The exam is split into a Core section (everyone takes it) plus three type
   sections that map to the kind of equipment a tech works on:
     - Type I   small appliances (≤5 lb, factory-sealed hermetic units)
     - Type II  high-pressure appliances (R-22, R-410A, supermarket racks…)
     - Type III low-pressure appliances (R-11/R-123 centrifugal chillers)
   Passing Core plus all three earns Universal certification.

   These cards cover the facts that come up most on the exam. Regulatory
   thresholds (leak rates, recovery vacuum levels) do change — the page that
   renders these reminds techs to confirm the current numbers against the
   EPA's published rule before relying on them in the field. */

export type EpaSectionId = 'core' | 'type1' | 'type2' | 'type3';

export type EpaSection = {
  id: EpaSectionId;
  /** Short label for tabs/badges. */
  label: string;
  /** Full name shown on the deck header. */
  name: string;
  blurb: string;
};

export const EPA_SECTIONS: EpaSection[] = [
  {
    id: 'core',
    label: 'Core',
    name: 'Core',
    blurb: 'Required of everyone — ozone science, the Clean Air Act, and refrigerant handling.',
  },
  {
    id: 'type1',
    label: 'Type I',
    name: 'Type I — Small Appliances',
    blurb: 'Factory-sealed units charged with 5 lb or less: fridges, window ACs, dehumidifiers.',
  },
  {
    id: 'type2',
    label: 'Type II',
    name: 'Type II — High-Pressure',
    blurb: 'High-pressure & very-high-pressure systems: split ACs, heat pumps, supermarket racks.',
  },
  {
    id: 'type3',
    label: 'Type III',
    name: 'Type III — Low-Pressure',
    blurb: 'Low-pressure centrifugal chillers running R-11, R-123, or R-113.',
  },
];

export type Flashcard = {
  section: EpaSectionId;
  q: string;
  a: string;
};

export const EPA_FLASHCARDS: Flashcard[] = [
  // ---------- Core ----------
  {
    section: 'core',
    q: 'Which atom in CFC and HCFC refrigerants destroys stratospheric ozone?',
    a: 'Chlorine. A single chlorine atom released into the stratosphere can break apart thousands of ozone molecules in a repeating chain reaction.',
  },
  {
    section: 'core',
    q: 'In which layer of the atmosphere is the ozone layer that protects us from UV radiation?',
    a: 'The stratosphere. Stratospheric ozone shields the surface from harmful ultraviolet (UV) radiation.',
  },
  {
    section: 'core',
    q: 'What international treaty set the schedule for phasing out ozone-depleting substances?',
    a: 'The Montreal Protocol (1987). In the U.S. it is implemented through Title VI / Section 608 of the Clean Air Act.',
  },
  {
    section: 'core',
    q: 'Define ODP and GWP.',
    a: 'ODP (Ozone Depletion Potential) measures how much a substance harms the ozone layer relative to CFC-11 (=1). GWP (Global Warming Potential) measures its heat-trapping effect relative to CO₂ (=1).',
  },
  {
    section: 'core',
    q: 'Since when has it been illegal to knowingly vent refrigerant, and what is the “de minimis” exception?',
    a: 'Venting CFCs/HCFCs has been illegal since July 1, 1992, and HFC substitutes since November 15, 1995. De minimis releases — small, unavoidable amounts during good-faith service, like the gas trapped in hoses — are not violations.',
  },
  {
    section: 'core',
    q: 'Distinguish RECOVER, RECYCLE, and RECLAIM.',
    a: 'Recover: remove refrigerant and store it in an external container, with no testing or processing. Recycle: clean it on-site for reuse by separating oil and passing it through filter-driers to cut moisture, acidity, and particulate. Reclaim: reprocess it to the AHRI 700 new-product purity standard, verified by chemical analysis.',
  },
  {
    section: 'core',
    q: 'Which purity standard must reclaimed refrigerant meet, and why does it matter?',
    a: 'AHRI Standard 700. Only refrigerant reclaimed to AHRI 700 may be sold to a new owner; recovered/recycled refrigerant may be returned only to the same owner’s equipment.',
  },
  {
    section: 'core',
    q: 'How full may a refrigerant recovery cylinder be filled, and why?',
    a: 'No more than 80% of its volume by liquid. The remaining headspace lets the liquid expand safely as temperature rises, preventing hydrostatic rupture.',
  },
  {
    section: 'core',
    q: 'What color scheme identifies a DOT refrigerant recovery cylinder?',
    a: 'A gray body with a yellow top (shoulder). Recovery cylinders must be DOT-approved and should never be overfilled.',
  },
  {
    section: 'core',
    q: 'Does EPA Section 608 technician certification expire, and who must hold it?',
    a: 'No — it is good for life. Anyone who maintains, services, repairs, or disposes of equipment that could release refrigerant must be certified, and certification is required to purchase regulated refrigerant.',
  },
  {
    section: 'core',
    q: 'How long must service records and sales/recovery documentation be retained?',
    a: 'Three (3) years.',
  },
  {
    section: 'core',
    q: 'What is the EPA SNAP program?',
    a: 'Significant New Alternatives Policy — the EPA program that reviews and lists acceptable (and unacceptable) substitute refrigerants and their use conditions.',
  },
  {
    section: 'core',
    q: 'Why should you never use oxygen or compressed air to pressure-test or clear a system?',
    a: 'Oxygen or air mixed with refrigerant and oil vapor can form an explosive mixture under pressure. Use dry nitrogen (often with a trace of refrigerant for leak detection) instead.',
  },

  // ---------- Type I ----------
  {
    section: 'type1',
    q: 'What defines a “small appliance” for Type I purposes?',
    a: 'A product manufactured, charged, and hermetically sealed at the factory with 5 pounds or less of refrigerant — e.g., refrigerators, freezers, window air conditioners, dehumidifiers, water coolers, and vending machines.',
  },
  {
    section: 'type1',
    q: 'Recovery target for a small appliance whose compressor still runs (recovery equipment made on/after Nov 15, 1993)?',
    a: 'Recover 90% of the refrigerant when the appliance’s compressor is operating.',
  },
  {
    section: 'type1',
    q: 'Recovery target for a small appliance with an inoperative compressor (equipment made on/after Nov 15, 1993)?',
    a: 'Recover 80% of the refrigerant. (Older recovery equipment, made before Nov 15, 1993, must reach 80% or 4 in. Hg vacuum.)',
  },
  {
    section: 'type1',
    q: 'Difference between system-dependent (passive) and self-contained (active) recovery?',
    a: 'System-dependent (passive) recovery relies on the appliance’s own compressor or internal pressure to push refrigerant out. Self-contained (active) recovery uses its own pump/compressor and works even when the appliance can’t run.',
  },
  {
    section: 'type1',
    q: 'On what equipment may system-dependent (passive) recovery be used?',
    a: 'Only on small appliances (5 lb or less). High-pressure equipment with larger charges requires self-contained recovery equipment.',
  },
  {
    section: 'type1',
    q: 'When using a self-sealing piercing valve for access, what should you check before assuming the job is done?',
    a: 'That the access fitting actually opened a clear path and the appliance reached the required recovery level — then verify with gauges. Piercing/saddle valves can clog or seal poorly on small lines.',
  },
  {
    section: 'type1',
    q: 'If the compressor in a small appliance will not run, how can you improve passive recovery?',
    a: 'Tap into both the high and low sides, recover liquid as well as vapor, and gently warm the compressor/heat the appliance to raise internal pressure and drive more refrigerant out.',
  },
  {
    section: 'type1',
    q: 'Before opening a sealed small-appliance system, what must you do?',
    a: 'Recover the refrigerant to the required level — venting it to the atmosphere is prohibited.',
  },

  // ---------- Type II ----------
  {
    section: 'type2',
    q: 'How is a HIGH-pressure refrigerant defined, with examples?',
    a: 'One with a boiling point between roughly −50°C and 10°C at atmospheric pressure — e.g., R-22, R-410A, R-407C, R-404A, R-134a, R-502, R-12.',
  },
  {
    section: 'type2',
    q: 'What is a VERY-high-pressure refrigerant, and what is special about recovering it?',
    a: 'One boiling below about −50°C, such as R-13 and R-503. It cannot be recovered as a liquid and must not be transferred to a disposable cylinder; use appropriate high-pressure recovery cylinders.',
  },
  {
    section: 'type2',
    q: 'For appliances normally containing 50 lb or more, what must the owner do about leaks?',
    a: 'Repair leaks that exceed the applicable annual leak-rate trigger, generally within 30 days. (Exam study material commonly cites ~15% for comfort cooling and ~35% for commercial & industrial process refrigeration — always confirm the current EPA threshold.)',
  },
  {
    section: 'type2',
    q: 'Why must non-condensables (air) be kept out of a high-pressure system?',
    a: 'Air raises head pressure and condensing temperature, lowers efficiency and capacity, and can cause overheating. It also throws off pressure-temperature readings during charging and recovery.',
  },
  {
    section: 'type2',
    q: 'What tool measures the deep vacuum used to verify evacuation, and in what units?',
    a: 'A micron (vacuum) gauge, reading in microns of mercury. A typical evacuation target for service is around 500 microns to remove moisture and non-condensables.',
  },
  {
    section: 'type2',
    q: 'After repairs, why pull a deep vacuum before recharging a high-pressure system?',
    a: 'To boil off and remove moisture and to evacuate air/non-condensables. Moisture left in the system forms acids and can freeze at the metering device.',
  },
  {
    section: 'type2',
    q: 'How does required recovery vacuum change with appliance charge size and equipment age (high-pressure)?',
    a: 'Larger charges and newer recovery equipment must reach deeper vacuums. For example, equipment made on/after Nov 15, 1993 must reach about 10 in. Hg for charges under 200 lb and 15 in. Hg for 200 lb or more. (Verify the exact table in the current rule.)',
  },
  {
    section: 'type2',
    q: 'What is the difference between recovering into an evacuated cylinder vs. push-pull?',
    a: 'Vapor/charged-cylinder recovery draws refrigerant into a cylinder under vacuum. Push-pull moves large liquid charges quickly by using the recovery machine to push vapor into the system, forcing liquid out into the recovery cylinder — used on systems with large charges.',
  },

  // ---------- Type III ----------
  {
    section: 'type3',
    q: 'How is a LOW-pressure refrigerant defined, with examples?',
    a: 'One with a boiling point above 10°C (about 50°F) at atmospheric pressure, so it operates in a vacuum on the low side — e.g., R-11, R-123, and R-113. These run in centrifugal chillers.',
  },
  {
    section: 'type3',
    q: 'What is the required recovery level for a low-pressure appliance?',
    a: 'Pull down to about 25 mm Hg absolute (≈29.9 in. Hg vacuum) with recovery equipment made on/after Nov 15, 1993; older equipment must reach about 25 in. Hg vacuum.',
  },
  {
    section: 'type3',
    q: 'When leak-testing or pressurizing a low-pressure chiller, what gas do you use and what pressure must you NOT exceed?',
    a: 'Use dry nitrogen and do not exceed 10 psig. Low-pressure vessels and their rupture disks are not built for high pressure — over-pressurizing risks rupturing the machine.',
  },
  {
    section: 'type3',
    q: 'At what pressure is the rupture disk on a low-pressure chiller typically set?',
    a: 'About 15 psig. This is why leak-test pressure is held well below it (≤10 psig).',
  },
  {
    section: 'type3',
    q: 'What does a purge unit do on a low-pressure chiller, and what does a high purge rate tell you?',
    a: 'The purge unit removes non-condensables (mainly air and moisture) that collect at the top of the condenser. A high or frequent purge rate signals that air is leaking in — i.e., the machine has a leak.',
  },
  {
    section: 'type3',
    q: 'On a low-pressure system, where is most refrigerant typically lost?',
    a: 'Through the purge unit. Efficient, modern purge units minimize the refrigerant carried out with the purged air.',
  },
  {
    section: 'type3',
    q: 'Why might you warm the refrigerant or use heat during low-pressure recovery?',
    a: 'Gentle heat raises the refrigerant’s pressure above the deep vacuum it normally sits in, helping push it out and speeding recovery from a low-pressure machine.',
  },
  {
    section: 'type3',
    q: 'Why should water keep flowing through the tubes during evacuation of a low-pressure chiller (or why monitor closely)?',
    a: 'To prevent the remaining water in the chiller/condenser tubes from freezing as the refrigerant boils off under deep vacuum and absorbs heat — frozen tubes can rupture.',
  },
];

/** Cards for a section, or all cards when no section is given. */
export function cardsForSection(section?: EpaSectionId): Flashcard[] {
  return section ? EPA_FLASHCARDS.filter((c) => c.section === section) : EPA_FLASHCARDS;
}
