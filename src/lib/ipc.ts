// src/lib/ipc.ts
export async function registerPatient(payload: any) {
  if (typeof window === 'undefined' || !window.api || !window.api.registerPatient) {
    throw new Error('IPC bridge not available');
  }

  const result = await window.api.registerPatient(payload);
  return result;
}
