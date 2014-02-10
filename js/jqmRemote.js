define(["jquery", "jquery.mobile", "app/jrmcServices"], function ($, $jqm, $jrmc) {
    // the global state of the player
    player = {
        lastPlayInfo: {ImageURL: null}, // the last info retrieved from the remote player
        view: {}, // the current page
        control: {}, // the different HTML components in player footer.
        configuration : {
            refresh: 500 // how many milliseconds before refreshing data from JRMC
        }
    };

    function noop() {
    }

    function setCookie(c_name, value, exdays) {
        // build date
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        // build cookie value
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        // set cookie
        document.cookie = c_name + '=' + c_value;
    }

// manage divs with data-role='view' to replace them with the content of the file referenced by data-src
    function loadViews() {
        var $viewHolders = $("[data-role='view']");
        $viewHolders.each(function () {
            var holder = $(this);
            var $src = holder.attr("data-src");
            $.ajax({url: $src, async: false}).done(function (data) {
                holder.replaceWith(data);
            });
        });
    }

    function updateLibraryView() {
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });
    }

    function updateNowPlaying(playInfo) {
        $("#np-cover").attr("src", playInfo.ImageURL);
        $("#np-title").text(playInfo.Name);
        $("#np-artist").text(playInfo.Artist);
        $("#np-album").text(playInfo.Album);
    }

    var preparePageContentCallbacks = {
        "library": updateLibraryView
    };

    var updateViewOnPlayerStatusCallbacks = {
        "now-playing": updateNowPlaying
    };

// called when a page is loaded via Ajax, then update the surrounding page.
    function preparePageContent() {
        var view = player.view;
        view.title = $.mobile.activePage.jqmData("title");
        view.type = $.mobile.activePage.jqmData("view");
        $("[data-role='header'] h1").text(view.title);
        (preparePageContentCallbacks[view.type] || noop)()
    }

    function updatePlayerControlStatus(playInfo) {
        this.title.text(playInfo.PositionDisplay + " " + playInfo.Name);
        var imageURL = playInfo.ImageURL;
        if (player.lastPlayInfo.ImageURL != imageURL) {
            this.cover.attr("src", imageURL);
        }
        var mute = player.control.mute;
        var slider = this.volume_slider.parent().find(".ui-slider-bg");
        if (playInfo.VolumeDisplay == $jrmc.infos.muted) {
            mute.addClass('muted');
            slider.addClass("muted");
        } else {
            mute.removeClass('muted');
            slider.removeClass("muted");
        }
        if (playInfo.State == 2) {
            this.playpause.removeClass('muted');
        } else {
            this.playpause.addClass('muted');
        }
        this.volume_slider.val(playInfo.Volume * 100).slider("refresh");
        this.currentVolume.text(playInfo.VolumeDisplay);
    }

    function refreshPlayerStatus() {
        $jrmc.getPlaybackInfo(function (playInfo) {
            updatePlayerControlStatus.call(player.control, playInfo);
            (updateViewOnPlayerStatusCallbacks[player.view.type] || noop).call(player.control, playInfo);
            player.lastPlayInfo = playInfo;
            setTimeout(refreshPlayerStatus, player.configuration.refresh);
        });
    }

    function createPlayerControl(player) {
        var footer = $(".player-control");
        player.control = {
            title: $(".now-playing", footer),
            next: $(".control-next", footer),
            previous: $(".control-prev", footer),
            stop: $(".control-stop", footer),
            playpause: $(".control-play", footer),
            mute: $(".control-vol-mute", footer),
            volinc: $(".control-vol-inc", footer),
            voldec: $(".control-vol-dec", footer),
            cover: $(".cover", footer),
            currentVolume: $(".control-current-volume", footer),
            volume_slider: $('#slider', footer)
        };
        return player.control;
    }

    function initializePlayControlCallbacks(control) {
        control.next.click($jrmc.next);
        control.playpause.click($jrmc.playpause);
        control.previous.click($jrmc.previous);
        control.stop.click($jrmc.stop);
        control.mute.click($jrmc.mute);
    }

    $(function () {
        $jrmc.init();
        loadViews();
        $("[data-role='header'], [data-role='footer']").toolbar();
        $("[data-role='popup']").popup();
        preparePageContent();
        initializePlayControlCallbacks(createPlayerControl(player));
        refreshPlayerStatus();
    });

// Update the contents of the pages when loading a new page with Ajax
    $(document).on("pageshow", "[data-role='page']", preparePageContent);
});