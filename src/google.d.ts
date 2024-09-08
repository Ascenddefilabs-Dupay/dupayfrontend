// src/types/google.d.ts
interface GoogleSignIn {
    accounts: {
      id: {
        initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
        renderButton: (element: HTMLElement, options: { theme: string; size: string }) => void;
      };
    };
  }
  
  interface Window {
    google: GoogleSignIn;
  }
  