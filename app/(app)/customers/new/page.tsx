import Link from 'next/link';
import { Button, Card, ErrorBanner, Field, Input, PageHeading, Textarea } from '@/components/ui';
import { createCustomer } from '../actions';

export const metadata = { title: 'New customer · TRACE' };

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-[520px]">
      <div className="mb-4">
        <Link href="/customers" className="text-[12.5px] text-text3 hover:text-accent">
          ← Customers
        </Link>
      </div>
      <PageHeading title="New customer" />

      <Card className="px-5 py-5">
        <ErrorBanner message={error} />
        <form action={createCustomer} className="flex flex-col gap-3">
          <Field label="Customer / company name" name="name">
            <Input id="name" name="name" required placeholder="Acme Warehouse" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact name" name="contact_name">
              <Input id="contact_name" name="contact_name" placeholder="Dana Owner" />
            </Field>
            <Field label="Phone" name="phone">
              <Input id="phone" name="phone" type="tel" placeholder="(555) 010-1234" />
            </Field>
          </div>
          <Field label="Email" name="email">
            <Input id="email" name="email" type="email" placeholder="dana@acme.com" />
          </Field>
          <Field label="Address" name="address">
            <Input id="address" name="address" placeholder="120 Industrial Way" />
          </Field>
          <Field label="Notes" name="notes">
            <Textarea id="notes" name="notes" rows={3} placeholder="Gate code, access hours, etc." />
          </Field>
          <Button type="submit" className="mt-1 w-full justify-center">
            Create customer →
          </Button>
        </form>
      </Card>
    </div>
  );
}
