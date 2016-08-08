$(function() {
  var IPinfo, displayIP, onDataReceived;
  IPinfo = {
    ip: '::1',
    hostname: 'localhost'
  };
  onDataReceived = function(data) {
    return IPinfo = data;
  };
  displayIP = function() {
    // $('#IPAddress').html(IPinfo.ip);
    // $('#HostName').html(IPinfo.hostname);
    $('#userAgent').html(navigator.userAgent);
    return true;
  };
  // $.getJSON("https://ipinfo.io", {}, onDataReceived).error(displayIP).complete(displayIP);
  displayIP();
  return true;
});
