$(function() {
  var AJAXdata, IPinfo, displayIP, onDataReceived;
  IPinfo = {
    ip: '::1',
    dns: 'localhost.localdomain'
  };
  onDataReceived = function(data) {
    return IPinfo = data;
  };
  displayIP = function() {
    $('#IPAddress').html(IPinfo.ip);
    $('#HostName').html(IPinfo.dns);
    $('#userAgent').html(navigator.userAgent);
    return true;
  };
  AJAXdata = {
    type: 'GET',
    url: 'http://cosmo.nyu.edu/~bw55/ip.php',
    contentType: 'application/json',
    success: onDataReceived,
    error: displayIP,
    complete: displayIP
  };
  $.ajax(AJAXdata);
  return true;
});
