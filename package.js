Package.describe({
    name: 'omega:direct-stream-access',
    version: '3.1.1',
    summary: 'Provides API to directly use Meteor\'s SockJS stream.',
    git: 'https://github.com/wojtkowiak/meteor-direct-stream-access',
    documentation: 'README.md'
});

Package.onUse(function onUse(api) {
    api.versionsFrom('1.4');
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
    Npm.depends({
        'ultimate-chai': '4.1.0'
    });

    api.use('ecmascript');
    api.use('ddp-common');
    api.use('cultofcoders:mocha');
    api.use('test-helpers');
    api.use('accounts-base');
    api.use('accounts-password');
    api.use('omega:direct-stream-access');

    api.addFiles(['src/tests/setup.client.js'], 'client');
    api.addFiles(['src/tests/setup.server.js'], 'server');

    api.addFiles([
        'src/tests/directStreamAccess.test.js',
        'src/tests/directStreamAccess.server.test.js',
        'src/tests/directStreamAccess.client.test.js'
    ]);
});
