$( () ->
    #
    #
    #
    P = {}
        #
        #
        #
    display = () ->
        if P.astronomerstelegram?
            p = $('#astronomerstelegram')
            p.empty()
            a = []
            for d in P.astronomerstelegram.data
                u = P.astronomerstelegram.url.replace(/%d/, d)
                a.push "<a href=\"#{u}\">#{d}</a>"
            p.html a.join ", "
        if P.cbet?
            p = $('#cbet')
            p.empty()
            a = []
            for d in P.cbet.data
                d6 = if d < 1000 then "000#{d}" else "00#{d}"
                d1 = if d < 1000 then Math.floor(d/100)*100 else Math.floor(d/1000)*1000
                z = if d < 1000 then "000#{d1}" else "00#{d1}"
                u = P.cbet.url.replace(/%06d/, d6).replace(/%s/, z)
                a.push "<a href=\"#{u}\">#{d}</a>"
            p.html a.join ", "
        true
    #
    #
    #
    if $.isEmptyObject P
        $.getJSON('pubs.json', {}, (data) -> P = data).fail( () -> alert("Data retrieval error!") ).done(display)
)
