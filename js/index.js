$(function () {
    var ip = { ip: "::1",
        hostname: "localhost.localdomain",
        city: "Tucson",
        region: "Arizona",
        country: "US" };
    var onDataReceived = function (data) { ip = data; };
    var displayIP = function () {
        $('#IPAddress').html(ip.ip);
        $('#HostName').html(ip.hostname);
        $('#userAgent').html(navigator.userAgent);
        $('#Location').html(ip.city + ", " + ip.region + ", " + ip.country);
    };
    $.get("https://ipinfo.io", onDataReceived, "jsonp").always(displayIP);
});
