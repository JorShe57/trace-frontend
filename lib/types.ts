/**
 * Type definitions for the T.R.A.C.E. diagnostic tree.
 *
 * The tree is a discriminated union keyed on `type`, so consumers get
 * exhaustive checks when rendering each node variant.
 */

/** Colour of the little phase pip shown on each step card. */
export type PipColor = 'grey' | 'yellow' | 'red' | 'green';

/**
 * Visual intent of an answer / step. Maps to accent (yes/green),
 * caution (warn/yellow) or danger (no/red) styling.
 */
export type AnswerStyle = '' | 'yes' | 'warn' | 'no';

/** Fields shared by every node. */
interface BaseNode {
  /** Human-readable phase label, e.g. "Phase 1 — Controls". */
  phase?: string;
  /** Colour of the phase pip. */
  phasePip?: PipColor;
}

/** Entry node: choose the equipment type. */
export interface UnitSelectNode extends BaseNode {
  type: 'unit-select';
  question: string;
  context?: string;
  units: UnitOption[];
}

export interface UnitOption {
  id: string;
  icon: string;
  name: string;
  sub: string;
  /** Id of the node to advance to. */
  next: string;
}

/** Yes / No (+ optional "not sure") question. */
export interface YesNoNode extends BaseNode {
  type: 'yn';
  question: string;
  context?: string;
  tip?: string;
  yes: string;
  no: string;
  unsure?: string;
}

/** A list of labelled answers. */
export interface ChoiceNode extends BaseNode {
  type: 'choice';
  question: string;
  context?: string;
  tip?: string;
  answers: ChoiceAnswer[];
}

export interface ChoiceAnswer {
  label: string;
  sub?: string;
  style?: AnswerStyle;
  next: string;
}

/** Terminal node: a diagnosis with next steps and tooling. */
export interface OutcomeNode extends BaseNode {
  type: 'outcome';
  title: string;
  icon?: string;
  finding?: string;
  /** Safety warning shown in a red flag, or null when none. */
  safety?: string | null;
  steps?: string[];
  tools?: string[];
}

export type TreeNode = UnitSelectNode | YesNoNode | ChoiceNode | OutcomeNode;

export type TreeMap = Record<string, TreeNode>;

/** A single resolved hop in the diagnostic path, used for the history trail. */
export interface HistoryEntry {
  nodeId: string;
  question: string;
  answer: string;
  style: AnswerStyle;
  phase: string;
}
