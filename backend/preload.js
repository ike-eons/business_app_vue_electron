// import { contextBridge, ipcRenderer } from 'electron';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('API', {
	minimize: async () => await ipcRenderer.send('minimize'),
	toggleMaximize: async (isMaximized) =>
		await ipcRenderer.send('toggle-maximize', isMaximized),

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
		let data = await ipcRenderer.invoke('user:create', user);
		return data;
	},
	userUpdate: async (user) => {
		let data = await ipcRenderer.invoke('user:update', user);
		return data;
	},
	userDelete: async (user) => {
		let data = await ipcRenderer.invoke('user:delete', user);
		return data;
	},
});
