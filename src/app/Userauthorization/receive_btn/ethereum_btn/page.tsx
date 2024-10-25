import React, { Suspense } from 'react';
import EthereumPage from './ethereumqr'; // adjust the path as necessary

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EthereumPage />
        </Suspense>
    );
}
