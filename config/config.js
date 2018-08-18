module.exports = {
	//MongoDB configuration
	development: {
		db: 'mongodb://localhost:27017/graphql',
		app: {
			name: 'graphql'
		}
	},
	production: {
		db: 'mongodb://<username>:<password>@<host:port>/graphql-api',
		app: {
			name: 'graphql'
		}
	}
};