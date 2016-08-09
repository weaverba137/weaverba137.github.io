$( () ->
    IPinfo =
        ip: '::1'
        dns: 'localhost.localdomain'
    onDataReceived = (data) ->
        IPinfo = data
    displayIP = () ->
        $('#IPAddress').html(IPinfo.ip)
        $('#HostName').html(IPinfo.dns)
        $('#userAgent').html(navigator.userAgent)
        true
    $.getJSON("http://cosmo.nyu.edu/~bw55/ip.php", {}, onDataReceived).error(displayIP).complete(displayIP)
    # displayIP()
    true
)
