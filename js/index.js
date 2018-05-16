$(function() {
  var IPinfo, displayIP, onDataReceived;
  IPinfo = {
    ip: '::1',
    hostname: 'localhost.localdomain',
    city: 'Tucson',
    region: 'Arizona',
    country: 'US'
  };
  onDataReceived = function(data) {
    return IPinfo = data;
  };
  displayIP = function() {
    $('#IPAddress').html(IPinfo.ip);
    $('#HostName').html(IPinfo.hostname);
    $('#userAgent').html(navigator.userAgent);
    $('#Location').html(IPinfo.city + ", " + IPinfo.region + ", " + IPinfo.country);
    return true;
  };
  $.get("https://ipinfo.io", onDataReceived, "jsonp").always(displayIP);
  return true;
});
