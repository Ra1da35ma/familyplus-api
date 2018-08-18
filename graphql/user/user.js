const {GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString} = require('graphql');
const UserModel = require('../../models/user');

const UserType = new GraphQLObjectType({
	name: 'User',
	description: 'A User on this Portal',
	fields: function () {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLID),
				description: 'The ID of the User'
			},
			name: {
				type: GraphQLString,
				description: 'The Name of the User'
			},
			email: {
				type: GraphQLString,
				description: 'The Email of the User'
			},
			phone: {
				type: GraphQLString,
				description: 'The Phone Number of the User'
			}
		}
	}
});


const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query Type',
	fields: function () {
		return {
			users: {
				type: new GraphQLList(UserType),
				resolve: () => {
					const users = UserModel.find({}).exec();
					if (!users) throw new Error('Error');
					return users;
				}
			},
			user: {
				type: UserType,
				args: {
					id: {
						type: new GraphQLNonNull(GraphQLID),
						description: 'The id of the User.'
					}
				},
				resolve: (_, args) => {
					const user = UserModel.findById(args.id).exec();
					if (!user) throw new Error('No User Found');
					return user;
				}
			}
		}
	}
});


const add = {
	type: UserType,
	args: {
		name: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params) {
		const user = new UserModel(params);
		const newUser = user.save();
		if (!newUser) {
			throw new Error('Error');
		}
		return newUser
	}
};


const remove = {
	type: UserType,
	args: {
		id: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params) {
		const removedUser = UserModel.findByIdAndRemove(params.id).exec();
		if (!removedUser) throw new Error('Error');
		return removedUser;
	}
};


const update = {
	type: UserType,
	args: {
		id: {
			name: 'id',
			type: new GraphQLNonNull(GraphQLString)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve(root, params) {
		return UserModel.findByIdAndUpdate(
				params.id,
				{$set: {name: params.name}},
				{new: true}
		)
				.catch(err => new Error(err));
	}
};


const mutation = {
	addUser: add,
	removeUser: remove,
	updateUser: update
};


exports.userSchema = new GraphQLSchema({
	query: QueryType,
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: mutation
	})
});