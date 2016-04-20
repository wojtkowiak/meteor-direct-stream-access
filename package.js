Package.describe({
    name: 'omega:direct-stream-access',
    version: '3.0.1',
    summary: 'Provides API to directly use Meteor\'s SockJS stream.',
    git: 'https://github.com/wojtkowiak/meteor-direct-stream-access',
    documentation: 'README.md'
});

Package.onUse(function onUse(api) {
    api.versionsFrom('METEOR@1.2');
    api.use('ecmascript');
    api.use(['ddp-common'], 'client');
    api.use(['underscore'], 'server');
    api.addFiles(['src/lib/DirectStreamAccess.js']);
    api.addFiles(['src/DirectStreamAccess.client.js'], 'client');
    api.addFiles(['src/DirectStreamAccess.server.js'], 'server');
    api.export('DirectStreamAccess', ['client', 'server'], { testOnly: true });
    api.addFiles('namespace.js');
});

Package.onTest(function onTest(api) {
    api.use('ecmascript');
    api.use('ddp-common');
    api.use('practicalmeteor:mocha');
    api.use('omega:dirty-chai');
    api.use('test-helpers');
    api.use('omega:direct-stream-access');
    api.addFiles([
        'src/tests/directStreamAccess.test.js',
        'src/tests/directStreamAccess.server.test.js',
        'src/tests/directStreamAccess.client.test.js'
    ]);
});
