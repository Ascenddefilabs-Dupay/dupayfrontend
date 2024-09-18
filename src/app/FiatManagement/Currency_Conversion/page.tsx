import { Suspense } from 'react';
import CurrencyConverter from './Currency_Conversion';

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CurrencyConverter />
  </Suspense>
);

export default Page;