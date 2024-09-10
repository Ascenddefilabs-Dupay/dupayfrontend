// // src/SignInGoogle/Home.js
// 'use client';

// import React from 'react'
// import QRCodeScanner from './QrScanner';


// function App() {
//   return (
//     <div>
//       <QRCodeScanner
//        />
//     </div>
//   );
// }

// export default App


'use client';

import React from 'react';
import QRCodeScanner from './QrScanner';  // Make sure QrScanner.tsx is typed correctly

const App: React.FC = () => {
  return (
    <div>
      <QRCodeScanner />
    </div>
  );
};

export default App;
