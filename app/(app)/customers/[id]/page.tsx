import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, Button, Card, Field, Input, SectionLabel, Select, Textarea } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import type { Customer, Equipment, Site } from '@/lib/db/types';
import { UNIT_TYPE_OPTIONS } from '@/lib/unit-types';
import { createEquipment, createSite, deleteCustomer } from '../actions';

export const metadata = { title: 'Customer · T.R.A.C.E.' };

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .maybeSingle<Customer>();
  if (!customer) notFound();

  const [{ data: sitesData }, { data: equipmentData }] = await Promise.all([
    supabase.from('sites').select('*').eq('customer_id', id).order('name'),
    supabase
      .from('equipment')
      .select('*')
      .order('label'),
  ]);
  const sites = (sitesData ?? []) as Site[];
  const equipment = (equipmentData ?? []) as Equipment[];
  const equipBySite = (siteId: string) => equipment.filter((e) => e.site_id === siteId);

  return (
    <div>
      <div className="mb-4">
        <Link href="/customers" className="font-mono text-[10px] text-text3 hover:text-accent">
          ← Customers
        </Link>
      </div>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-head text-[24px] font-bold tracking-[0.06em] text-text">{customer.name}</h1>
          <div className="mt-1 font-mono text-[10px] text-text3">
            {[customer.contact_name, customer.phone, customer.email].filter(Boolean).join(' · ') ||
              'No contact info'}
          </div>
          {customer.address && <div className="mt-0.5 text-[11px] text-text2">{customer.address}</div>}
        </div>
        <form action={deleteCustomer}>
          <input type="hidden" name="id" value={customer.id} />
          <Button type="submit" variant="danger" className="px-2.5 py-1.5">
            Delete
          </Button>
        </form>
      </div>

      {customer.notes && (
        <Card className="mb-5 px-4 py-3">
          <SectionLabel>Notes</SectionLabel>
          <p className="whitespace-pre-wrap text-[12px] leading-[1.5] text-text2">{customer.notes}</p>
        </Card>
      )}

      <div className="mb-3 flex items-center justify-between">
        <SectionLabel>Sites &amp; equipment</SectionLabel>
      </div>

      <div className="flex flex-col gap-4">
        {sites.map((site) => (
          <Card key={site.id} className="px-4 py-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <div className="text-[14px] font-semibold text-text">{site.name}</div>
                {site.address && <div className="font-mono text-[9px] text-text3">{site.address}</div>}
              </div>
              <Badge>{equipBySite(site.id).length} units</Badge>
            </div>

            {equipBySite(site.id).length > 0 && (
              <ul className="mb-3 flex flex-col gap-1.5">
                {equipBySite(site.id).map((e) => (
                  <li
                    key={e.id}
                    className="rounded-[4px] border border-border2 bg-bg3 px-3 py-2 text-[12px] text-text"
                  >
                    <span className="text-text">{e.label}</span>
                    <span className="ml-2 font-mono text-[9px] text-text3">
                      {[e.manufacturer, e.model, e.serial && `SN ${e.serial}`].filter(Boolean).join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <details className="group">
              <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
                + Add equipment
              </summary>
              <form action={createEquipment} className="mt-2 grid grid-cols-2 gap-2">
                <input type="hidden" name="customer_id" value={customer.id} />
                <input type="hidden" name="site_id" value={site.id} />
                <div className="col-span-2">
                  <Field label="Label" name={`label-${site.id}`}>
                    <Input name="label" required placeholder="RTU-3 (rooftop)" />
                  </Field>
                </div>
                <Field label="Unit type" name={`unit_type-${site.id}`}>
                  <Select name="unit_type" defaultValue="">
                    <option value="">—</option>
                    {UNIT_TYPE_OPTIONS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Manufacturer" name={`manufacturer-${site.id}`}>
                  <Input name="manufacturer" placeholder="Carrier" />
                </Field>
                <Field label="Model" name={`model-${site.id}`}>
                  <Input name="model" />
                </Field>
                <Field label="Serial" name={`serial-${site.id}`}>
                  <Input name="serial" />
                </Field>
                <div className="col-span-2">
                  <Button type="submit" variant="ghost" className="w-full justify-center">
                    Add equipment
                  </Button>
                </div>
              </form>
            </details>
          </Card>
        ))}

        <Card className="px-4 py-3">
          <details className="group">
            <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-[0.08em] text-accent">
              + Add a site
            </summary>
            <form action={createSite} className="mt-2 flex flex-col gap-2">
              <input type="hidden" name="customer_id" value={customer.id} />
              <Field label="Site name" name="site-name">
                <Input name="name" required placeholder="Main warehouse" />
              </Field>
              <Field label="Address" name="site-address">
                <Input name="address" placeholder="120 Industrial Way" />
              </Field>
              <Textarea name="notes" rows={2} placeholder="Access notes (optional)" />
              <Button type="submit" variant="ghost" className="w-full justify-center">
                Add site
              </Button>
            </form>
          </details>
        </Card>
      </div>
    </div>
  );
}
