$( () ->
    #
    # Empty object to hold JSON data.
    #
    P = {}
    #
    # Render article data.
    #
    renderArticle = (article) ->
        if article.author[article.author.length-1] == "et al."
            article.author[article.author.length-1] = "<em>et al.</em>"
        authors = (au.replace(/ +/g, "&nbsp;") for au in article.author).join(", ")
        title = "&ldquo;#{article.title}&rdquo;"
        h = [authors, title]
        number = if article.number? then "(#{article.number})" else ""
        if article.journal?
            if article.url?
                u = article.url
            else
                if article.id?
                    u = "https://ui.adsabs.harvard.edu/abs/#{article.id}/abstract"
                else
                    u = null
            j = article.journal.replace(/ +/g, "&nbsp;")
            if article.conference?
                h.push "&ldquo;#{article.conference}&rdquo;"
            h.push "<em>#{j}</em> <strong>#{article.volume}</strong>#{number} (#{article.year}) #{article.pages}"
        else
            #
            # Assume arXiv
            #
            u = "https://arxiv.org/abs/#{article.id}"
            h.push "arXiv:#{article.id}"
        p = $("<p/>").addClass("pub")
        if u?
            a = $("<a/>").attr("href", u).html(h.join(", ") + ".")
            a.appendTo p
        else
            p = p.html(h.join(", ") + ".")
        p
    #
    # Render a set of articles.
    #
    renderArticles = (articles) ->
        for own k, v of articles
            div = $("##{k}")
            div.empty()
            h3 = $("<h3/>").html(v.title).appendTo div
            for r in v.data
                p = renderArticle r
                p.appendTo div
        true
    #
    # Render a set of notices.
    #
    renderNotices = (notices) ->
        for own k, v of notices
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
        true
    #
    # Main function.
    #
    display = () ->
        renderArticles P.articles
        renderNotices P.notices
        renderArticles P.links
        true
    #
    # Load JSON.
    #
    if $.isEmptyObject P
        $.getJSON('pubs.json', {}, (data) -> P = data).fail( () -> alert("Data retrieval error!") ).done(display)
)
