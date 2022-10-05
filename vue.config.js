module.exports = {
	pluginOptions: {
		electronBuilder: {
			// nodeIntegration: true,
			preload: 'backend/preload.js',
		},
		externals: ['sqlite3'],
	},
	transpileDependencies: ['vuetify'],
};
