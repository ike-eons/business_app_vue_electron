'use strict';

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';
const path = require('path');
require('../database/models/db_connection');

// const User = require('../database/models/Users.js');
import User from '../database/models/Users.js';
import // defaultUser,
// allUsers,
// getTotalUser,
// loginUser,
'../database/controllers/UserController.js';

process.on('ReferenceError', (err) => {
	const messageBoxOptions = {
		type: 'error',
		title: 'Error in Main process',
		message: err.message,
	};
	dialog.showMessageBoxSync(messageBoxOptions);

	app.exit(1);
});
process.on('uncaughtException', (err) => {
	const messageBoxOptions = {
		type: 'error',
		title: 'Error in Main process',
		message: err.message,
	};
	dialog.showMessageBoxSync(messageBoxOptions);
	app.exit(1);
});

let win = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } },
]);

User.createTable();

async function createWindow() {
	// Create the browser window.
	// defaultUser();
	win = new BrowserWindow({
		width: 800,
		height: 600,
		frame: false,
		// fullscreen: true,
		webPreferences: {
			// Use pluginOptions.nodeIntegration, leave this alone
			// See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
			// nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			// contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, '../backend/preload.js'),
			show: false,
			sandbox: false,
		},
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		win.show();
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		win.loadURL('app://./index.html');
		win.show();
	}

	// getTotalUser().then((data) => {
	// 	win.webContents.send('user:totalUsers', data);
	// });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS_DEVTOOLS);
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString());
		}
	}
	createWindow();
	// (async function (_, size) {
	// 	try {
	// 		let rows = await User.getAll();
	// 		size = rows.length;
	// 		console.log('***length***********');
	// 		console.log(size);
	// 		console.log(win);
	// 		// event.sender.send('users:total', size);
	// 		win.webContents.send('users:total', size);
	// 	} catch (error) {
	// 		return console.log(error);
	// 	}
	// })();
});

ipcMain.on('minimize', () => {
	win.minimize();
});
ipcMain.on('toggle-maximize', (_, isMaximize) => {
	if (isMaximize == true) {
		win.maximize();
		// win.getFocusedWindow().maximize();
	} else {
		win.unmaximize();
		// win.getFocusedWindow().unmaximize();
	}
});
// ipcMain.on('unmaximize', () => {
// 	win.unmaximize();
// });
// ipcMain.on('ismaximized', () => {
// 	win.isMaximized();
// });
ipcMain.on('close', () => {
	win.destroy();
});

ipcMain.handle('user:login', async (_, user) => {
	try {
		const stored_user = await User.loginUser(user);
		return stored_user;
	} catch (error) {
		return console.log(error);
	}
});
ipcMain.handle('user:create', saveData);

ipcMain.handle('users:load', loadData);
ipcMain.on('users:loadtotal', async (event, users) => {
	try {
		const u = await User.getAll();
		users = u.length;
		win.webContents.send('users:total', users);
		if (!u) {
			return { error: "user doesn't exit" };
		}
		return u;
	} catch (error) {
		console.log(error.message);
	}
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit();
			}
		});
	} else {
		process.on('SIGTERM', () => {
			app.quit();
		});
	}
}

async function saveData(event, data) {
	try {
		// console.log(data);
		await User.insert(data);
		return { message: 'success' };
	} catch (e) {
		console.log(e.message);
	}
}

async function loadData(_, data) {
	try {
		const res = await User.getAll();
		data = res;
		return data;
	} catch (error) {
		console.log(error.message);
	}
}
