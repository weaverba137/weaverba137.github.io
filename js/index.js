$(function () {
    let ip = { ip: "::1",
        hostname: "localhost.localdomain",
        city: "Tucson",
        region: "Arizona",
        country: "US" };
    let onDataReceived = function (data) { ip = data; };
    let displayIP = function () {
        $('#IPAddress').html(ip.ip);
        $('#HostName').html(ip.hostname);
        $('#userAgent').html(navigator.userAgent);
        $('#Location').html(ip.city + ", " + ip.region + ", " + ip.country);
    };
    $.getJSON("https://ipinfo.io/json", {}, onDataReceived).always(displayIP);
});
