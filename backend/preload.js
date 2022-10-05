// import { ipcRenderer } from 'electron';
// const { ipcRenderer } = require('electron');
// window.ipcRenderer = ipcRenderer;

// alert('this is just a test');

// import { contextBridge, ipcRenderer } from 'electron';
const { contextBridge, ipcRenderer } = require('electron');

// console.log(ipcRenderer.send);
// console.log(ipcRenderer.invoke);
// console.log(ipcRenderer.on);

contextBridge.exposeInMainWorld('API', {
	minimize: async () => await ipcRenderer.send('minimize'),
	toggleMaximize: async (isMaximized) =>
		await ipcRenderer.send('toggle-maximize', isMaximized),
	// unmaximize: () => ipcRenderer.send('unmaximize'),
	// ismaximized: () => ipcRenderer.send('ismaximized'),
	close: async () => await ipcRenderer.send('close'),

	userLogin: async (user) => {
		let data = await ipcRenderer.invoke('user:login', user);
		return data;
	},
	usersFetch: async (users) => {
		let data = await ipcRenderer.invoke('users:load', users);
		return data;
	},
	userCreate: async (user) => {
		console.log(user);
		let data = await ipcRenderer.invoke('user:create', user);
		return data;
	},
});
