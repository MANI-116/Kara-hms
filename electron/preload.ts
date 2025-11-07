import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  /* ---------- OP (Outpatient) ---------- */
  registerPatient: async (payload: any) => {
    return ipcRenderer.invoke('patient:register', payload);
  },
  getPatients: async () => {
    return ipcRenderer.invoke('patient:getAll');
  },
  searchPatients: async (term: string) => {
    return ipcRenderer.invoke('patient:search', term);
  },

  /* ---------- IP (Inpatient) ---------- */
  createIP: async (payload: any) => {
    return ipcRenderer.invoke('ip:create', payload);
  },
  getIPs: async () => {
    return ipcRenderer.invoke('ip:getAll');
  }
});

