$( () ->
    qso = []
    replot -> ()
        true
    onDataReceived -> (data)
        true
    if qso.length == 0
        $.getJSON('lib/qso.json', {}, onDataReceived).error( () -> alert("Data retrieval error!") ).complete(replot)
)
