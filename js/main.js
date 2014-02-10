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

requirejs(['jquery', 'jquery.mobile', 'jquery.img.lazy', 'jquery.cookie', 'app/jrmcServices', 'app/jqmRemote']);

