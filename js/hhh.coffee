$( () ->
    hhh = []
    #
    # Used to control hovering.
    #
    previousPoint = null
    replot = () ->
        plot1_area = $("#plot1_area")
        plot2_area = $("#plot2_area")
        # Months are in the range 0-11.
        start_year = (new Date(2002, 0, 1)).getTime()
        next_year = (new Date(((new Date()).getFullYear() + 1), 0, 1)).getTime()
        special_dates = [
            {time: (new Date(2003,10,20)).getTime(), label: 'Met S.M.', offset: 150}
            {time: (new Date(2006,1,11)).getTime(), label: 'Met T.H.', offset: 350}
            {time: (new Date(2008,6,1)).getTime(), label: 'To N.Y.C.', offset: 600}
            {time: (new Date(2010,10,13)).getTime(), label: 'Met K.G.', offset: 900}
            {time: (new Date(2012,6,31)).getTime(), label: 'To W.H.', offset: 1050}
            {time: (new Date(2016,7,1)).getTime(), label: 'To Tucson', offset: 1200}
        ]
        markings = []
        for d in special_dates
            markings.push {color: 'black', lineWidth: 1, xaxis: { from: d.time, to: d.time }}
        plot1_options =
            legend:
                show: false
            grid:
                hoverable: true
            series:
                lines:
                    show: true
                points:
                    show: true
            xaxis:
                mode: 'time'
                timeformat: '%Y'
                minTickSize: [1, 'year']
            selection:
                mode: 'xy'
        plot2_options =
            legend:
                show: false
            series:
                lines:
                    show: true
                    lineWidth: 1
                points:
                    show: false
                shadowSize: 0
            xaxis:
                mode: 'time'
                timeformat: '%Y'
                minTickSize: [1, 'year']
                min: start_year
                max: next_year
            grid:
                markings: markings
            selection:
                mode: 'xy'
        plot1 = $.plot plot1_area, hhh, plot1_options
        plot2 = $.plot plot2_area, hhh, plot2_options
        ctx = plot2.getCanvas().getContext("2d")
        arrowhead = (ctx, o) ->
            #
            # Draw a little arrow on top of the last label to demonstrate canvas drawing
            #
            ctx.beginPath()
            o.left += 4
            ctx.moveTo o.left, o.top
            ctx.lineTo o.left, o.top - 10
            ctx.lineTo o.left + 10, o.top - 5
            ctx.lineTo o.left, o.top
            ctx.fillStyle = "#000"
            ctx.fill()
        for d in special_dates
            o = plot2.pointOffset { x: d.time, y: d.offset}
            label_css =
                position: 'absolute'
                left: "#{o.left + 4}px"
                top: "#{o.top}px"
                color: '#666'
                "font-size": 'smaller'
            $('<div/>').html(d.label).css(label_css).appendTo(plot2_area)
            arrowhead ctx, o
        #
        # Contents of tool tip.
        #
        showTooltip = (item) ->
            point = hhh[item.seriesIndex].data[item.dataIndex]
            extra = hhh[item.seriesIndex].meta[item.dataIndex]
            contents = "#{point[1]}<br/>#{point[0].toISOString().split('T')[0]}<br/>#{extra[0]}<br/>#{extra[1]}<br/>#{extra[3]}"
            if extra[2]
                contents += "<br/>#{extra[2]}"
            tooltip_css =
                position: 'absolute'
                display: 'none'
                top: item.pageY + 5
                left: item.pageX + 5
                border: '1px solid gray'
                padding: '2px'
                "background-color": 'silver'
                opacity: 0.8
            $("<div id=\"tooltip\"/>").html(contents).css(tooltip_css).appendTo('body').fadeIn(200)
        #
        # Action to perform when hovering over a point.
        #
        handle_plot_hover = (event, pos, item) ->
            if item
                if previousPoint != item.dataIndex
                    $('#tooltip').remove()
                    showTooltip item
                    previousPoint = item.dataIndex
            else
                $('#tooltip').remove()
                previousPoint = null
        plot1_area.bind "plotselected", (event, ranges) ->
            #
            # clamp the zooming to prevent eternal zoom
            #
            if ranges.xaxis.to - ranges.xaxis.from < 86400*1000
                ranges.xaxis.to = ranges.xaxis.from + 86400*1000
            if ranges.yaxis.to - ranges.yaxis.from < 1
                ranges.yaxis.to = ranges.yaxis.from + 1
            #
            # do the zooming
            #
            plot1 = $.plot(plot1_area, hhh,
                $.extend(true, {}, plot1_options, {
                    xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
                    yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
                })
                )
            #
            # don't fire event on the overview to prevent eternal loop
            #
            plot2.setSelection(ranges, true)
        plot1_area.bind "plothover", handle_plot_hover
        plot2_area.bind "plotselected", (event, ranges) -> plot1.setSelection(ranges)
    #
    #
    #
    onDataReceived = (data) ->
        hhh = [
            {data: [], meta:[], color: 'black', label: 'Hashes'}
        ]
        for row in data
            date = new Date(row[1])
            if row[0] > 0
                hhh[0].data.push [date, row[0]]
                hhh[0].meta.push [row[2], row[3], row[4], row[5]]
        hhh
    #
    #
    #
    if hhh.length == 0
        $.getJSON('hhh.json', {}, onDataReceived).fail( () -> alert("Data retrieval error!") ).done(replot)
)
