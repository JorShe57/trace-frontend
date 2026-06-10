import Link from 'next/link';
import { PageHeading } from '@/components/ui';
import { RefrigerantCalculator } from '@/components/RefrigerantCalculator';

export const metadata = { title: 'Refrigerant Calculator · TRACE' };

export default function RefrigerantCalculatorPage() {
  return (
    <div>
      <PageHeading
        title="Refrigerant Calculator"
        subtitle="Superheat & subcooling from your gauge and line readings."
        action={
          <Link
            href="/tools"
            className="text-[12.5px] font-medium text-text3 hover:text-text2"
          >
            ← Tools
          </Link>
        }
      />
      <RefrigerantCalculator />
    </div>
  );
}
