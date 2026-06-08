import { TREE, ROOT_ID } from './tree';
import type {
  AnswerStyle,
  HistoryEntry,
  PipColor,
  TreeNode,
  UnitOption,
} from './types';

export { TREE, ROOT_ID };

/** Look up a node by id. */
export function getNode(id: string): TreeNode | undefined {
  return TREE[id];
}

/** Colour of the phase pip for a node, defaulting to grey. */
export function pipColor(id: string): PipColor {
  return getNode(id)?.phasePip ?? 'grey';
}

/**
 * The set of child node ids reachable from a node, in answer order.
 * Used to validate URLs and to resolve which answer was taken.
 */
function edges(node: TreeNode): string[] {
  switch (node.type) {
    case 'unit-select':
      return node.units.map((u) => u.next);
    case 'yn':
      return [node.yes, node.no, node.unsure].filter(Boolean) as string[];
    case 'choice':
      return node.answers.map((a) => a.next);
    case 'outcome':
      return [];
  }
}

/**
 * Resolve the answer label + style for the hop from `node` to `childId`.
 * When more than one answer points at the same child (e.g. Yes and "Not sure"
 * both continuing the path) we prefer the first / primary match.
 */
function resolveAnswer(
  node: TreeNode,
  childId: string,
): { answer: string; style: AnswerStyle } {
  switch (node.type) {
    case 'unit-select': {
      const u = node.units.find((x) => x.next === childId);
      return { answer: u?.name ?? '—', style: '' };
    }
    case 'yn': {
      if (childId === node.yes) return { answer: 'Yes', style: 'yes' };
      if (childId === node.no) return { answer: 'No', style: 'no' };
      return { answer: 'Not sure', style: '' };
    }
    case 'choice': {
      const a = node.answers.find((x) => x.next === childId);
      return { answer: a?.label ?? '—', style: (a?.style as AnswerStyle) ?? '' };
    }
    case 'outcome':
      return { answer: '', style: '' };
  }
}

/**
 * Validate a path of node ids. A valid path:
 *   - starts at ROOT_ID
 *   - every hop follows a real edge
 *   - only the final node may be an outcome (terminal)
 * Returns the longest valid prefix so a partially-broken URL still resolves.
 */
export function sanitizePath(path: string[]): string[] {
  if (path.length === 0 || path[0] !== ROOT_ID) return [ROOT_ID];
  const out: string[] = [ROOT_ID];
  for (let i = 1; i < path.length; i++) {
    const prev = getNode(out[out.length - 1]);
    if (!prev) break;
    if (!edges(prev).includes(path[i])) break;
    if (!getNode(path[i])) break;
    out.push(path[i]);
    if (getNode(path[i])?.type === 'outcome') break; // terminal
  }
  return out;
}

/** Build the history trail (everything except the current node). */
export function buildHistory(path: string[]): HistoryEntry[] {
  const history: HistoryEntry[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const node = getNode(path[i]);
    if (!node) continue;
    const { answer, style } = resolveAnswer(node, path[i + 1]);
    history.push({
      nodeId: path[i],
      question: 'question' in node ? node.question : (node as { title?: string }).title ?? '',
      answer,
      style,
      phase: node.phase ?? '',
    });
  }
  return history;
}

/** The equipment unit selected at the start, derived from the path. */
export function selectedUnit(path: string[]): UnitOption | null {
  const start = getNode(ROOT_ID);
  if (!start || start.type !== 'unit-select' || path.length < 2) return null;
  return start.units.find((u) => u.next === path[1]) ?? null;
}

/** Ordered, de-duplicated list of phases visited (for the breadcrumb). */
export function breadcrumb(path: string[]): string[] {
  const phases = path
    .map((id) => getNode(id)?.phase)
    .filter((p): p is string => Boolean(p));
  return [...new Set(phases)];
}

/** Encode a path array into a URL segment list. */
export function pathToHref(path: string[]): string {
  return `/diagnostic/${path.join('/')}`;
}

/**
 * Integrity check: returns every edge that points at a node id which is not
 * defined in the tree. A dangling edge would otherwise dead-end navigation
 * silently (sanitizePath stops at the missing target). Run at module load in
 * development so authoring mistakes are loud, not invisible.
 */
export function findDanglingEdges(): { from: string; to: string }[] {
  const problems: { from: string; to: string }[] = [];
  for (const [id, node] of Object.entries(TREE)) {
    for (const to of edges(node)) {
      if (!getNode(to)) problems.push({ from: id, to });
    }
  }
  return problems;
}

if (process.env.NODE_ENV !== 'production') {
  const dangling = findDanglingEdges();
  if (dangling.length > 0) {
    console.warn(
      `[T.R.A.C.E.] ${dangling.length} dangling tree edge(s) — these dead-end navigation:`,
      dangling,
    );
  }
}
