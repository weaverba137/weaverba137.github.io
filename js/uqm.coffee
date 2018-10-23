$( () ->
    #
    # Global variables.
    #
    UQM =
        stars: []
        current_star: 82 # Sol
        positions: [
            {data: [], id: [], color: 'black'}
            {data: [], id: [], color: 'blue'}
            {data: [], id: [], color: 'red'}
        ]
        spoilers: false
        plotoptions:
            points:
                show: true
            grid:
                hoverable: true
                clickable: true
            xaxis:
                ticks: 11
                min: 0
                max: 1000
            yaxis:
                ticks: 11
                min: 0
                max: 1000
        zoomoptions:
            points:
                show: true
            grid:
                hoverable: true
                clickable: true
            xaxis:
                min: 0
                max: 150
            yaxis:
                min: 0
                max: 150
        previousPoint: null
        placeholder: $("#placeholder")
        zoomholder: $("#zoomholder")
        #
        # Return a name string for a star object.
        #
        getName: (id) ->
            n = @stars[id]
            if n.name then n.name + " " + n.constellation else n.constellation
        #
        # Find a star id number given its position in a plot.
        #
        getID: (series, data) ->
            @positions[series].id[data]
        #
        # Convert the list of stars into arrays for flot.
        #
        getPositions: () ->
            for p in @positions
                p.data = []
                p.id = []
            for s in @stars
                p = 0
                p = 1 if s.constellation == @stars[@current_star].constellation
                p = 2 if s.id == @current_star
                @positions[p].data.push s.position
                @positions[p].id.push s.id
            @positions
        #
        # Calculate zoom limits.
        #
        zoomPosition: () ->
            FloorCeil = (position) ->
                Floor = position - 75.0
                Ceil = position + 75.0
                if Floor < 0
                    Floor = 0.0
                    Ceil = 150.0
                if Ceil > 1000.0
                    Floor = 1000.0 - 150.0
                    Ceil = 1000.0
                foo =
                    min: Floor
                    max: Ceil
            @zoomoptions.xaxis = FloorCeil @stars[@current_star].position[0]
            @zoomoptions.yaxis = FloorCeil @stars[@current_star].position[1]
            @zoomoptions
        #
        # Print star information.
        #
        starInfo: () ->
            star = @stars[@current_star]
            $("#h3info").html("Information on #{@getName @current_star}")
            $("#dlinfo").empty()
            $('<dt/>').html("Coordinates").appendTo($("#dlinfo"))
            $('<dd/>').html(@formatPosition(star.position)).appendTo($("#dlinfo"))
            $('<dt/>').html("Type").appendTo($("#dlinfo"))
            $('<dd/>').html("#{star.colour} #{star.type}").appendTo($("#dlinfo"))
            $('<dt/>').html("QuasiSpace Portal").appendTo($("#dlinfo"))
            $('<dd/>').html(@formatPosition(star.quasi)).appendTo($("#dlinfo"))
            $('<dt/>').html("Total Mineral RU").appendTo($("#dlinfo"))
            $('<dd/>').html(star.total_minerals).appendTo($("#dlinfo"))
            $('<dt/>').html("Total Bio Units").appendTo($("#dlinfo"))
            $('<dd/>').html(star.total_bio).appendTo($("#dlinfo"))
            if @spoilers and star.special?
                $('<dt/>').html("Special Feature").appendTo($("#dlinfo"))
                $('<dd/>').html(star.special).appendTo($("#dlinfo"))
            star
        #
        # Create a table of planet data.
        #
        planetTable: () ->
            planets = @stars[@current_star].planets
            $("#tableofplanets").empty()
            #
            # Table Header.
            #
            titles = [
                'Planet'
                'Type'
                'Orbital Radius [AU]'
                'Atmospheric Pressure [atm]'
                'Temperature [&deg;C]'
                'Weather Activity'
                'Tectonic Activity'
                'Mass [M<sub>E</sub>]'
                'Radius [R<sub>E</sub>]'
                'Gravity [g]'
                'Rotation Period [d]'
                'Axial Tilt'
                'Mineral RU'
                'Bio Units'
                'Special Notes'
            ]
            $("<caption/>").html("Planets of #{@getName @current_star}").appendTo($("#tableofplanets"))
            $('<thead id="theadplanets"/>').appendTo($("#tableofplanets"))
            $('<tr id="thplanets"/>').appendTo($("#theadplanets"))
            for t in titles
                if t == 'Special Notes'
                    $('<th/>').addClass("special").html(t).appendTo($("#thplanets"))
                else
                    $('<th/>').html(t).appendTo($("#thplanets"))
            $('<tbody id="tbodyplanets"/>').appendTo($("#tableofplanets"))
            k = 0
            for p in planets
                rowid = 'p'+k
                k += 1
                $('<tr id="'+rowid+'"></tr>').appendTo($("#tbodyplanets"))
                rowref = $('#'+rowid)
                if p.sat?
                    $('<td/>').html(p.rom+p.sat).css({"text-align": "right"}).appendTo(rowref)
                else
                    $('<td/>').html(p.rom).appendTo(rowref)
                $('<td/>').html(p.typ).appendTo(rowref)
                if p.sat?
                    $('<td/>').html("").appendTo(rowref)
                else
                    $('<td/>').html(p.orb.toFixed(2)).appendTo(rowref)
                $('<td/>').html(p.atm).appendTo(rowref)
                $('<td/>').html(p.tmp).appendTo(rowref)
                $('<td/>').html(p.wea).appendTo(rowref)
                $('<td/>').html(p.tec).appendTo(rowref)
                $('<td/>').html(p.mss.toFixed(2)).appendTo(rowref)
                $('<td/>').html(p.rad.toFixed(2)).appendTo(rowref)
                $('<td/>').html(p.grv.toFixed(2)).appendTo(rowref)
                $('<td/>').html(p.day.toFixed(2)).appendTo(rowref)
                $('<td/>').html(p.tlt+"&deg;").appendTo(rowref)
                $('<td/>').html(p.min).appendTo(rowref)
                $('<td/>').html(p.lif).appendTo(rowref)
                $('<td/>').addClass("special").html(p.art).appendTo(rowref)
            #
            # Make the table visible.
            #
            $(".special").css({"display":(if @spoilers then "table-cell" else "none")})
            planets
        #
        # Contents of tool tip.
        #
        showTooltip: (item, tooltipid) ->
            id = @getID item.seriesIndex, item.dataIndex
            contents = "#{@getName id} (#{@formatPosition id})"
            tooltip_css =
                position: 'absolute'
                display: 'none'
                top: item.pageY + 5
                left: item.pageX + 5
                border: '1px solid gray'
                padding: '2px'
                "background-color": 'silver'
                opacity: 0.8
            $("<div id=\"#{tooltipid}\"/>").html(contents).css(tooltip_css).appendTo('body').fadeIn(200)
        #
        # Convert a position into a nice string.
        #
        formatPosition: (pos) ->
            pp = if pos instanceof Array then pos else @stars[pos].position
            formatX = (x) ->
                prefix = ""
                prefix += "0" if x < 10
                prefix += "0" if x < 100
                prefix += x.toFixed 1
            "#{formatX pp[0]}:#{formatX pp[1]}"
    #
    # Replot the data with a new star.
    #
    rePlot = () ->
        plot_data = UQM.getPositions()
        plot = $.plot UQM.placeholder, plot_data, UQM.plotoptions
        zoomoptions = UQM.zoomPosition()
        zoom = $.plot UQM.zoomholder, plot_data, zoomoptions
    #
    # Action to perform when hovering over a star.
    #
    handle_map_hover = (id) ->
        (event, pos, item) ->
            if item
                if UQM.previousPoint != item.dataIndex
                    $('#'+id).remove()
                    UQM.showTooltip item, id
                    UQM.previousPoint = item.dataIndex
            else
                $('#'+id).remove()
                UQM.previousPoint = null
    #
    # Action to perform when clicking on a star.
    #
    handle_map_click = (event, pos, item) ->
        if item
            id = UQM.getID item.seriesIndex, item.dataIndex
            UQM.current_star = id
            rePlot()
            UQM.starInfo()
            UQM.planetTable()
    #
    # Bind functions to events.
    #
    UQM.placeholder.bind "plothover", handle_map_hover('tooltip')
    UQM.zoomholder.bind "plothover", handle_map_hover('zoomtip')
    UQM.placeholder.bind 'plotclick', handle_map_click
    UQM.zoomholder.bind 'plotclick', handle_map_click
    #
    # Bind to the spoiler buttons.
    #
    $(".spoiler").change(() ->
        UQM.spoilers = ($("input[name=spoiler]:checked").val() == "ON")
    ).change()
    #
    # Fill in the data arrays and plot.
    #
    if UQM.stars.length == 0
        $.getJSON("uqm.json",{},(data) -> UQM.stars = data).error(
            () -> alert("JSON error!")
            ).complete(rePlot)
)
