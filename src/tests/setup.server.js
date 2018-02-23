import { Accounts } from 'meteor/accounts-base'

if (!Meteor.users.findOne({ username: 'test' })) {
    Accounts.createUser({ username: 'test', password: 'test' });
}

Meteor.__testEnv = {};
Meteor.__testEnv.userId = Meteor.users.findOne({ username: 'test' })._id;
