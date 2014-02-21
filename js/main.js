// require.js configuration
requirejs.config({
    baseUrl: 'js/libs',
    paths: {
        app: '..'
    },
    shim: {
        "jquery.mobile": {
            deps: ["jquery"]
        },
        "jquery.img.lazy": {
            deps: ["jquery"]
        },
        "jquery.cookie": {
            deps: ["jquery"]
        }
    }
});

requirejs(['app/jqmRemote'], function (app) {
    $jqmRemote = app;
});

