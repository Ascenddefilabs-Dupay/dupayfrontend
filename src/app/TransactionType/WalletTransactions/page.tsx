// // src/SignInGoogle/Home.js
// 'use client';

// import React from 'react'
// import UserForm from './WalletTransactions'
// import CurrencyForm from './WalletTransactions';


// function App() {
//   return (
//     <div>
//       <CurrencyForm />
//     </div>
//   );
// }

// export default App



'use client';

import React from 'react';
import UserForm from './WalletTransactions';
import CurrencyForm from './WalletTransactions';

const App: React.FC = () => {
  return (
    <div>
      <CurrencyForm />
    </div>
  );
}

export default App;