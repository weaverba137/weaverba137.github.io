$( () ->
    #
    #
    #
    P = {}
        #
        #
        #
    display = () ->
        for own k, v of P.notices
            div = $("##{k}")
            div.empty()
            h3 = $("<h3/>").html(v.title).appendTo div
            a = []
            for d in v.data
                if k == "cbet"
                    d6 = if d < 1000 then "000#{d}" else "00#{d}"
                    d1 = if d < 1000 then Math.floor(d/100)*100 else Math.floor(d/1000)*1000
                    z = if d < 1000 then "000#{d1}" else "00#{d1}"
                    u = v.url.replace(/%06d/, d6).replace(/%s/, z)
                else
                    u = v.url.replace(/%d/, d)
                a.push "<a href=\"#{u}\">#{d}</a>"
            p = $("<p/>").html(a.join ", ").appendTo div
        for own k, v of P.other
            div = $("##{k}")
            div.empty()
            h3 = $("<h3/>").html(v.title).appendTo div
            for r in v.data
                if r.author[r.author.length-1] == "et al."
                    r.author[r.author.length-1] = "<em>et al.</em>"
                authors = (au.replace(/ +/g, "&nbsp;") for au in r.author).join(", ")
                title = "&ldquo;#{r.title}&rdquo;"
                h = [authors, title]
                if k == "arXiv"
                    u = "https://arxiv.org/abs/#{r.id}"
                    h.push "#{k}:#{r.id}"
                else
                    u = "https://ui.adsabs.harvard.edu/abs/#{r.id}/abstract"
                    j = r.journal.replace(/ +/g, "&nbsp;")
                    h.push "<em>#{j}</em> <strong>#{r.volume}</strong> (#{r.year}) #{r.pages}"
                p = $("<p/>").addClass("pub")
                a = $("<a/>").attr("href", u).html(h.join(", ") + ".")
                a.appendTo p
                p.appendTo div
        true
    #
    #
    #
    if $.isEmptyObject P
        $.getJSON('pubs.json', {}, (data) -> P = data).fail( () -> alert("Data retrieval error!") ).done(display)
)
