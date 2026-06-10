import Link from 'next/link';
import { ButtonLink, Card, EmptyState, PageHeading } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import type { Customer } from '@/lib/db/types';

export const metadata = { title: 'Customers · TRACE' };

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true });
  const customers = (data ?? []) as Customer[];

  return (
    <div>
      <PageHeading
        title="Customers"
        subtitle="The accounts and contacts you service."
        action={<ButtonLink href="/customers/new">+ New customer</ButtonLink>}
      />

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          hint="Add a customer to start tracking their sites, equipment and service history."
          action={<ButtonLink href="/customers/new">+ New customer</ButtonLink>}
        />
      ) : (
        <Card className="divide-y divide-border">
          {customers.map((c) => (
            <Link
              key={c.id}
              href={`/customers/${c.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-bg3"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] text-text">{c.name}</div>
                <div className="mt-0.5 text-[12px] text-text3">
                  {[c.contact_name, c.phone, c.email].filter(Boolean).join(' · ') || 'No contact info'}
                </div>
              </div>
              <span className="text-[13px] text-text3">→</span>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}
