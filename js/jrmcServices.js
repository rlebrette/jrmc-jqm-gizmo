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
    $service.increaseVolume = function (level) {
        $service.changeVolume(level, 1);
    };
    $service.decreaseVolume = function (level) {
        $service.changeVolume(-level, 1);
    };
    $service.theaterHome = function () {
        invokeMCC(22001, 1);
    };
    $service.theaterFullscreen = function () {
        invokeMCC(22000, 4);
    };
    $service.theaterNP = function () {
        invokeMCC(22001, 2);
    };
    $service.mute = function () {
        invokeMCC(10017, 0);
    };
    $service.showDSP = function () {
        invokeMCC(10016, 0);
    };
    $service.key = function (key) {
        return function () {
            invoke({run: "Control/Key", params: {Key: key, Focus: 1}})
        }
    };
    $service.getPlaybackInfo = function () {
        return invoke({run: "Playback/Info"})
    };
    $service.getFileInfo = function (key) {
        return invoke({run: "File/GetInfo", params: {File: key}})
    };
    $service.changeVolume = function (level, relative) {
        invoke({run: "Playback/Volume", params: {Level: level, Relative: relative}});
    };
    $service.playFile = function (fileKey, action) {
        var params = {Key: fileKey};
        switch (action) {
            case 'add-to-end':
                params.Location = 'End';
                break;
            case 'add-as-next':
                params.Location = 'Next';
                break;
        }
        invoke({run: "Playback/PlayByKey", params: params});
    };
    /*
     This function is providing the mechanism to invoke JRMC services with the right JRMC's token and the current zone.
     It returns a deferred object that will resolve as a function returning the data in JSON format.

     <i>For example:</i>
     invoke({run: "Playback/PlayByKey", params: {Key: 10001}}).then(doSomethingOnSuccess, doSomethingOnError)
     */
    var invoke = function (operation) {
        var defResult = $.Deferred();
        var params = $.extend({Token: $service.infos.token, Zone: $service.zone}, operation.params);
        $.ajax({url: "/MCWS/v1/" + operation.run + "?" + $.param(params), async: operation.async || false}).then(
            function (data) {
                defResult.resolve(function () {
                    return convertJRMCToJSON(data);
                })
            },
            function (xhr) {
                defResult.reject(xhr);
            }
        );
        return defResult;
    };
    var invokeMCC = function (command, parameter) {
        invoke({run: "Control/MCC", params: {Command: command, Parameter: parameter}})
    };
    var convertJRMCToJSON = function (data) {
        var content;
        var elem = {};
        var xml = $(data);
        var response = xml.find("Response");
        if (response.length > 0) {
            // we have a standard response from JRMC.
            elem.ResponseStatus = $("Response", xml).attr("Status");
            content = xml.find("Item");
        } else {
            // we hase a response in MPL format.
            content = xml.find("Field");
        }
        $(content).each(function () {
            var value = $(this);
            elem[value.attr("Name")] = value.text();
        });
        return elem;
    };
    return $service;
});
