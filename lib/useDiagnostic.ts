'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ROOT_ID,
  breadcrumb,
  buildHistory,
  getNode,
  pathToHref,
  sanitizePath,
  selectedUnit,
} from './engine';
import type { TreeNode } from './types';

const LAST_PATH_KEY = 'trace.lastPath';

export interface Diagnostic {
  /** Sanitised list of node ids, root first, current last. */
  path: string[];
  /** The node currently being shown. */
  current: TreeNode;
  /** Id of the current node. */
  currentId: string;
  history: ReturnType<typeof buildHistory>;
  unit: ReturnType<typeof selectedUnit>;
  crumbs: string[];
  atStart: boolean;
  isOutcome: boolean;
  /** Advance to a child node id, pushing a new URL. */
  navigate: (nextId: string) => void;
  /** Pop the last step. */
  back: () => void;
  /** Return to the equipment picker. */
  restart: () => void;
}

/**
 * Drives a URL-backed diagnostic session. The route's catch-all segments are
 * the source of truth, so every step is deep-linkable and the browser's own
 * back button works. We mirror the current path into localStorage so the
 * landing page can offer a "resume" affordance.
 */
export function useDiagnostic(rawPath: string[]): Diagnostic {
  const router = useRouter();
  const path = useMemo(() => sanitizePath(rawPath), [rawPath]);

  const currentId = path[path.length - 1];
  const current = getNode(currentId)!;
  const history = useMemo(() => buildHistory(path), [path]);
  const unit = useMemo(() => selectedUnit(path), [path]);
  const crumbs = useMemo(() => breadcrumb(path), [path]);
  const isOutcome = current.type === 'outcome';
  const atStart = path.length <= 1;

  // Persist the latest valid path for resume.
  useEffect(() => {
    try {
      window.localStorage.setItem(LAST_PATH_KEY, JSON.stringify(path));
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }, [path]);

  const navigate = useCallback(
    (nextId: string) => {
      router.push(pathToHref([...path, nextId]));
    },
    [path, router],
  );

  const back = useCallback(() => {
    if (path.length <= 1) return;
    router.push(pathToHref(path.slice(0, -1)));
  }, [path, router]);

  const restart = useCallback(() => {
    router.push(pathToHref([ROOT_ID]));
  }, [router]);

  return {
    path,
    current,
    currentId,
    history,
    unit,
    crumbs,
    atStart,
    isOutcome,
    navigate,
    back,
    restart,
  };
}

/** Read the last persisted path (used by the landing page resume banner). */
export function readLastPath(): string[] | null {
  try {
    const raw = window.localStorage.getItem(LAST_PATH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 1) return parsed as string[];
  } catch {
    /* ignore */
  }
  return null;
}

export interface ResumeInfo {
  href: string;
  label: string;
}

let cachedPathKey = '';
let cachedResume: ResumeInfo | null = null;

function buildResume(path: string[]): ResumeInfo {
  const node = getNode(path[path.length - 1]);
  const history = buildHistory(path);
  const where =
    node && node.type === 'outcome'
      ? node.title
      : node && 'question' in node
        ? node.question
        : 'In progress';
  return {
    href: pathToHref(path),
    label: `${history.length} step${history.length === 1 ? '' : 's'} in · ${where}`,
  };
}

function readResumeFromStorage(): ResumeInfo | null {
  const last = readLastPath();
  const key = last ? last.join('/') : '';
  if (key === cachedPathKey) return cachedResume;
  cachedPathKey = key;
  cachedResume = last ? buildResume(last) : null;
  return cachedResume;
}

/** Resume banner data from the last persisted diagnostic path. */
export function useResume(): ResumeInfo | null {
  const [resume, setResume] = useState<ResumeInfo | null>(null);

  useEffect(() => {
    setResume(readResumeFromStorage());
  }, []);

  return resume;
}
