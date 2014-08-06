var g_token;
var g_zone;

function create_xmlhttp() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
}

function send_xmlhttp(xmlhttp, url, async) {
    // add unique string to avoid caching of xmlhttp
    if (url.indexOf("?") == -1) {
        url += "?NoCache=" + Math.random();
    } else {
        url += "&NoCache=" + Math.random();
    }
    
    // send
    xmlhttp.open("GET", url, async);
    xmlhttp.send("");
}

function download(url, async) {
    var xmlhttp = create_xmlhttp();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            xmlhttp = null;
        }
    }
    send_xmlhttp(xmlhttp, url, async);
}

function download_refresh(url) {
    download(url, false);
    setTimeout("reload()", 500);
}

function reload() {
    location.reload(true);
}

function download_jump_playing_now(url) {
    var xmlhttp = create_xmlhttp();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            window.location.href = "../old/playingnow.html";
            xmlhttp = null;
        }
    }
    send_xmlhttp(xmlhttp, url, true);
}

function download_update_display(url) {
    var xmlhttp = create_xmlhttp();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            download_display_playing_information();
            xmlhttp = null;
        }
    }
    send_xmlhttp(xmlhttp, url, true);
}

function download_display_html(url, id) {
    var xmlhttp = create_xmlhttp();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            document.getElementById(id).innerHTML = xmlhttp.responseText;
            xmlhttp = null;
        }
    }
    send_xmlhttp(xmlhttp, url, true);
}

function download_display_image(url, id) {
    var xmlhttp = create_xmlhttp();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            document.getElementById(id).src = xmlhttp.responseText;
            xmlhttp = null;
        }
    }
    send_xmlhttp(xmlhttp, url, true);
}

function download_display_playing_information() {
    var xmlhttp = create_xmlhttp();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {

            // load response  
            var xml = xmlhttp.responseXML;
            var root = xml.getElementsByTagName("Response");

            // see if response is valid
            if ((root != null) && (root.length == 1) && (xml.documentElement.getAttribute("Status") == "OK")) {

                // get all items
                var items = xml.getElementsByTagName("Item");
                if (items != null) {

                    // loop items
                    for (var i = 0; i < items.length; i++) {

                        // parse values
                        var name = items[i].getAttribute("Name");
                        var value = items[i].childNodes[0].nodeValue;

                        // get corresponding element
                        var element = document.getElementById("PlaybackInfo." + name);
                        if (element != null) {

                            // update element
                            if ((element.src != null) && (element.src != "")) {
                                if (element.src != value)
                                    element.src = value; // image
                            } else {
                                if (element.innerHTML != value)
                                    element.innerHTML = value; // text
                            }
                        }
                        
                        // special handling
                        if (name == "Volume") {
                            var volume = parseFloat(value) * 100;
                            $("#volumeslider").slider("option", "value", volume.toFixed(0));
                        } else if (name == "PositionMS") {
                            $("#positionslider").slider("option", "value", parseInt(value));
                        } else if (name == "DurationMS") {
                            $("#positionslider").slider("option", "max", parseInt(value));
                        }
                    }
                }

                xmlhttp = null;
            }
        }
    }
    send_xmlhttp(xmlhttp, "MCWS/v1/Playback/Info?Zone=" + g_zone + "&Token=" + g_token, true);
}

function init_playingnow(token, zone) {
    // store token
    g_token = token;
    g_zone = zone;    
    
    // volume slider
    $("#volumeslider").slider({
		value: 0,
		min: 0,
		max: 100
	});
    $("#volumeslider").bind("slidechange", function(event, ui) {
		if (!event.originalEvent) return;
		var volume = ui.value / 100.0;
		download_update_display('MCWS/v1/Playback/Volume?Zone=' + g_zone + '&Level=' + volume.toFixed(3) + '&Token=' + g_token);
	});

    // position slider
    $("#positionslider").slider({
		value: 0,
		min: 0,
		max: 0
	});
    $("#positionslider").bind("slidechange", function(event, ui) {
		if (!event.originalEvent) return;
		download_update_display('MCWS/v1/Playback/Position?Zone=' + g_zone + '&Position=' + ui.value + '&Token=' + g_token);
	});
	
    // update information once now
    download_display_playing_information();

    // update again every little bit
    setInterval("download_display_playing_information()", 5000);
}

function set_cookie(c_name, value, exdays) {
    // build date
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);

    // build cookie value
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        
    // set cookie
    document.cookie = c_name + "=" + c_value;
}