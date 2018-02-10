$( () ->
    hhh = []
    # Used to control hovering.
    previousPoint = null
    replot = () ->
        plot1_area = $("#plot1_area")
        plot2_area = $("#plot2_area")
        # Months are in the range 0-11.
        start_year = (new Date(2002, 0, 1)).getTime()
        next_year = (new Date(((new Date()).getFullYear() + 1), 0, 1)).getTime()
        special_dates = [
            {time: (new Date(2003,10,20)).getTime(), label: 'Met Shelley', offset: 150}
            {time: (new Date(2006,1,11)).getTime(), label: 'Met Tracey', offset: 350}
            {time: (new Date(2008,6,1)).getTime(), label: 'To NYC', offset: 600}
            {time: (new Date(2010,10,13)).getTime(), label: 'Met Kim', offset: 900}
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
        showTooltip = (item, tooltipid) ->
            point = hhh[item.seriesIndex].data[item.dataIndex]
            contents = "#{point[1]}, #{point[0]}"
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
        # Action to perform when hovering over a point.
        #
        handle_plot_hover = (id) ->
            (event, pos, item) ->
                if item
                    if previousPoint != item.dataIndex
                        $('#'+id).remove()
                        showTooltip item, id
                        previousPoint = item.dataIndex
                else
                    $('#'+id).remove()
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
        plot1_area.bind "plothover", handle_plot_hover('tooltip')
        plot2_area.bind "plotselected", (event, ranges) -> plot1.setSelection(ranges)
    #
    #
    #
    onDataReceived = (data) ->
        hhh = [
            {data: [], color: 'black', label: 'Hashes'}
        ]
        # for d in data
        #     if d.number > 0
        #         hhh[0].data.push [d.date,d.number]
        for line in data.split "\n"
            row = line.split ","
            if row[0] != "Number"
                number = parseInt(row[0])
                date = new Date(row[1])
                if number > 0
                    hhh[0].data.push [date, number]
        hhh
    #
    #
    #
    if hhh.length == 0
        # $.getJSON('lib/hashes.json',{},onDataReceived).error( () -> alert("JSON error!") ).complete(replot)
        $.get('lib/hashes.csv', {}, onDataReceived, "text").error( () -> alert("Data retrieval error!") ).complete(replot)
)
