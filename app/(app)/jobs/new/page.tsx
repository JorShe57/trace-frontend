import Link from 'next/link';
import { Button, Card, ErrorBanner, Field, Input, PageHeading, Select, Textarea } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { JOB_PRIORITIES, JOB_STATUSES, type Customer, type Equipment, type Site } from '@/lib/db/types';
import { createJob } from '../actions';

export const metadata = { title: 'New job · T.R.A.C.E.' };

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; customer?: string; equipment?: string }>;
}) {
  const { error, customer, equipment } = await searchParams;
  const supabase = await createClient();

  const [{ data: customersData }, { data: equipmentData }, { data: sitesData }] = await Promise.all([
    supabase.from('customers').select('*').order('name'),
    supabase.from('equipment').select('*').order('label'),
    supabase.from('sites').select('*'),
  ]);
  const customers = (customersData ?? []) as Customer[];
  const equipmentList = (equipmentData ?? []) as Equipment[];
  const sites = (sitesData ?? []) as Site[];
  const siteName = (id: string) => sites.find((s) => s.id === id)?.name ?? 'Site';

  return (
    <div className="mx-auto max-w-[520px]">
      <div className="mb-4">
        <Link href="/jobs" className="font-mono text-[10px] text-text3 hover:text-accent">
          ← Jobs
        </Link>
      </div>
      <PageHeading title="New job" />

      <Card className="px-5 py-5">
        <ErrorBanner message={error} />
        <form action={createJob} className="flex flex-col gap-3">
          <Field label="Title" name="title">
            <Input id="title" name="title" required placeholder="No cooling — RTU-3 service call" />
          </Field>
          <Field label="Description" name="description">
            <Textarea id="description" name="description" rows={3} placeholder="What the customer reported." />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Status" name="status">
              <Select id="status" name="status" defaultValue="open">
                {JOB_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Priority" name="priority">
              <Select id="priority" name="priority" defaultValue="normal">
                {JOB_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Scheduled for" name="scheduled_for" hint="Optional.">
            <Input id="scheduled_for" name="scheduled_for" type="datetime-local" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Customer" name="customer_id" hint="Optional.">
              <Select id="customer_id" name="customer_id" defaultValue={customer ?? ''}>
                <option value="">—</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Equipment" name="equipment_id" hint="Optional.">
              <Select id="equipment_id" name="equipment_id" defaultValue={equipment ?? ''}>
                <option value="">—</option>
                {equipmentList.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label} · {siteName(e.site_id)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Button type="submit" className="mt-1 w-full justify-center">
            Create job →
          </Button>
        </form>
      </Card>
    </div>
  );
}
