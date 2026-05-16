import { HomePage } from '@/components/home-page';
import { memorialPageSchema, personSchema, webSiteSchema } from '@/lib/structured-data';

const jsonLd = [personSchema(), webSiteSchema(), memorialPageSchema()];

export default function Home() {
  return <HomePage jsonLd={jsonLd} />;
}
