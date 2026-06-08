import { NextResponse } from 'next/server';

/**
 * Stub session API — a placeholder for persisting completed diagnostics
 * (e.g. for analytics, tech reports, or a service-history backend).
 *
 * Wire this up to your datastore of choice later. For now it validates the
 * shape and echoes back a fake id so the front end can be built against it.
 */

export interface DiagnosticSession {
  /** The node-id chain the technician walked. */
  path: string[];
  /** Equipment unit id chosen at the start. */
  unitId?: string;
  /** Final outcome node id, if completed. */
  outcomeId?: string;
  /** ISO timestamp the session was submitted. */
  completedAt?: string;
  /** Optional free-text notes from the technician. */
  notes?: string;
}

export async function POST(request: Request) {
  let body: DiagnosticSession;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(body.path) || body.path.length === 0) {
    return NextResponse.json({ error: 'path is required' }, { status: 422 });
  }

  // TODO: persist `body` to a datastore here.
  const id = `sess_${Date.now().toString(36)}`;

  return NextResponse.json({ id, received: body }, { status: 201 });
}

export async function GET() {
  // TODO: return stored sessions. Stubbed empty for now.
  return NextResponse.json({ sessions: [] });
}
