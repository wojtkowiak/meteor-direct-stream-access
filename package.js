Package.describe({
    name: 'omega:direct-stream-access',
    version: '0.0.1',
    summary: 'Provides API to directly access Meteor\'s SockJS stream.',
    // URL to the Git repository containing the source code for this package.
    git: '',
    documentation: 'README.md'
});

Package.onUse(function onUse(api) {
    api.versionsFrom('1.1.0.2');
    api.use('ecmascript');
    api.use('ddp-common');
    api.use('underscore');
    api.addFiles(['src/lib/common/DirectStreamAccess.js']);
    api.addFiles(['src/lib/DirectStreamAccess.client.js'], 'client');
    api.addFiles(['src/lib/DirectStreamAccess.server.js'], 'server');
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
        'src/tests/directStreamAccess.tests.js',
        'src/tests/directStreamAccess.server.tests.js',
        'src/tests/directStreamAccess.client.tests.js'
    ]);

});
