// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  registerPatient: async (payload: any) => {
    return ipcRenderer.invoke('patient:register', payload);
  },
  getPatients: async () => {
    return ipcRenderer.invoke('patient:getAll');
  },
  searchPatients: async (term: string) => {
    return ipcRenderer.invoke('patient:search', term);
  }
});
