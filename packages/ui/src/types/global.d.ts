// src/types/global.d.ts
export {};

declare global {
  interface Window {
    api: {
      registerPatient: (payload: any) => Promise<{ ok: boolean; patient?: any; error?: string; details?: any }>;
    };
  }
}
