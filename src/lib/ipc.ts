// src/lib/ipc.ts
export async function registerPatient(payload: any) {
  if (!window?.api?.registerPatient) throw new Error('IPC not available');
  return window.api.registerPatient(payload);
}

export async function getPatients() {
  if (!window?.api?.getPatients) throw new Error('IPC not available');
  return window.api.getPatients();
}

export async function searchPatients(term: string) {
  if (!window?.api?.searchPatients) throw new Error('IPC not available');
  return window.api.searchPatients(term);
}
