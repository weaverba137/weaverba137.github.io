$( () ->
    IPinfo =
        ip: '::1'
        hostname: 'localhost.localdomain'
        city: 'Tucson'
        region: 'Arizona'
        country: 'US'
    onDataReceived = (data) ->
        IPinfo = data
    displayIP = () ->
        $('#IPAddress').html(IPinfo.ip)
        $('#HostName').html(IPinfo.hostname)
        $('#userAgent').html(navigator.userAgent)
        $('#Location').html(IPinfo.city + ", " + IPinfo.region + ", " + IPinfo.country)
        true
    $.get("https://ipinfo.io", onDataReceived, "jsonp").always(displayIP)
    true
)
