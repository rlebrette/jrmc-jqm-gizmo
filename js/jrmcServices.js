define(['jquery'], function ($) {
    // This object provides several services that are helping the user to deal with the JRMC web APIs
    var $service = {};
    $service.zone = 0;
    $service.init = function () {
        $.ajax({url: "data/infos.json", async: false}).done(
            function (data) {
                $service.infos = $.parseJSON(data);
            }
        )
    };
    $service.next = function () {
        invoke({run: "Playback/Next"})
    };
    $service.previous = function () {
        invoke({run: "Playback/Previous"})
    };
    $service.stop = function () {
        invoke({run: "Playback/Stop"})
    };
    $service.playpause = function () {
        invoke({run: "Playback/PlayPause"})
    };
    $service.mute = function () {
        invokeMCC(10017, 0);
    };
    $service.showDSP = function () {
        invokeMCC(10016, 0);
    };
    $service.key = function (key) {
        return function () {
            invoke({run: "Control/Key", params: {Key: key, Focus:1}})
        }
    };
    $service.getPlaybackInfo = function (callback) {
        invoke({run: "Playback/Info"}, callback)
    };

    var invoke = function (operation, callback) {
        var params = $.extend({Token: $service.infos.token, ZoneId: $service.zone}, operation.params);
        $.ajax({url: "/MCWS/v1/" + operation.run + "?" + $.param(params), async: operation.async || false}).done(
            function (data) {
                if (callback != undefined) {
                    callback(convertToJSON(data));
                }
            }
        )
    };
    var invokeMCC = function (command, parameter) {
        invoke({run: "Control/MCC", params: {Command: command, Parameter: parameter}})
    };
    var convertToJSON = function (data) {
        var elem = {};
        elem.ResponseStatus = $("Response", data).attr("Status");
        var result = $("Item", data);
        $(result).each(function () {
            var value = $(this);
            elem[value.attr("Name")] = value.text();
        });
        return elem;
    };
    return $service;
});
