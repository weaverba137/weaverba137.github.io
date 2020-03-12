$( () ->
    #
    #
    #
    Publications =
        #
        #
        #
        data: {}
        #
        #
        #
        display: () ->
            if @data.astronomerstelegram?
                alert @data.astronomerstelegram.url.replace(/%d/, @data.astronomerstelegram.data[0])
            true
    #
    #
    #
    onDataReceived = (data) ->
        Publications.data = data
        true
    #
    #
    #
    if $.isEmptyObject(Publications.data)
        $.getJSON('pubs.json', {}, onDataReceived).fail( () -> alert("Data retrieval error!") ).done(Publications.display)
)
