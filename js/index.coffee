$( () ->
    IPinfo =
        ip: '::1'
        hostname: 'localhost'
    onDataReceived = (data) ->
        IPinfo = data
    displayIP = () ->
        # $('#IPAddress').html(IPinfo.ip)
        # $('#HostName').html(IPinfo.hostname)
        $('#userAgent').html(navigator.userAgent)
        true
    # $.getJSON("http://ipinfo.io", {}, onDataReceived).error(displayIP).complete(displayIP)
    displayIP()
    true
)
