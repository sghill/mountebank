'use strict';

var assert = require('assert'),
    validator = require('w3cjs'),
    api = require('../api/api'),
    httpClient = require('../api/http/baseHttpClient').create('http'),
    fs = require('fs'),
    timeout = parseInt(process.env.SLOW_TEST_TIMEOUT_MS || 3000);

describe('html validation', function () {
    this.timeout(timeout);

    [
        '/contributing',
        '/license',
        '/faqs',
        '/thoughtworks',
        '/docs/gettingStarted',
        '/docs/install',
        '/docs/glossary',
        '/docs/commandLine',
        '/docs/api/overview',
        '/docs/api/mocks',
        '/docs/api/stubs',
        '/docs/api/predicates',
        '/docs/api/proxies',
        '/docs/api/injection',
        '/docs/api/errors',
        '/docs/protocols/http',
        '/docs/protocols/https',
        '/docs/protocols/tcp',
        '/docs/protocols/smtp'
    ].forEach(function (endpoint) {
        it(endpoint + ' should have no html errors', function (done) {
            var spec = {
                port: api.port,
                method: 'GET',
                path: endpoint,
                headers: { accept: 'text/html' }
            };

            httpClient.responseFor(spec).then(function (response) {
                fs.writeFileSync('validation-test.html', response.body);
                validator.validate({
                    file: 'validation-test.html',
                    callback: function (response) {
                        fs.unlinkSync('validation-test.html');
                        assert.strictEqual(0, response.messages.length, JSON.stringify(response.messages));
                        done();
                    }
                });
            });
        });
    });
});
