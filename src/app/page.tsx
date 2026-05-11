import { HomePage } from '@/components/home-page';
import { eventsSchema, memorialPageSchema, personSchema, webSiteSchema } from '@/lib/structured-data';

const jsonLd = [personSchema(), webSiteSchema(), memorialPageSchema(), ...eventsSchema()];

export default function Home() {
  return <HomePage jsonLd={jsonLd} />;
}
