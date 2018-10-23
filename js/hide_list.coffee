toggle = (link) ->
    i = $(link).prev()
    ul = $(link).next()
    while ul.prop('nodeName') != 'UL' then ul = ul.next()
    if ul.css('display') == 'none' or ul.css('display') is null
        ul.css 'display', 'block'
        # i.removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down")
        i.html("&blacktriangledown;&nbsp;")
    else
        ul.css 'display', 'none'
        # i.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right")
        i.html("&blacktriangleright;&nbsp;")
    true
