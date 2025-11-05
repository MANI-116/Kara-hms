import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { z } from 'zod';

const isDev = process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER === 'true';

console.log(isDev)
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // compiled version
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev){
     win.loadURL('http://localhost:5173/')
    console.log("loaded from the dev")
  }else win.loadFile(path.join(__dirname, '../build-render/index.html'));
}

app.whenReady().then(createWindow);

const PatientSchema = z.object({
  fullName: z.string().min(3),
  age: z.number().int().min(0).max(150),
  gender: z.enum(['Male', 'Female', 'Other']),
  contact: z.string().min(7)
});

ipcMain.handle('patient:register', (_, payload) => {
  const parsed = PatientSchema.parse(payload);
  console.log("parsed:",parsed);
  return { ok: true, patient: { ...parsed, id: 'P' + Date.now() } };
});
