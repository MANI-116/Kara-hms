import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  registerPatient: (payload: any) => ipcRenderer.invoke('patient:register', payload)
});
