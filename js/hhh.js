(function() {
  $(function() {
    var hhh, onDataReceived, previousPoint, replot;
    hhh = [];
    previousPoint = null;
    replot = function() {
      var arrowhead, ctx, d, handle_plot_hover, i, j, label_css, len, len1, markings, next_year, o, plot1, plot1_area, plot1_options, plot2, plot2_area, plot2_options, showTooltip, special_dates, start_year;
      plot1_area = $("#plot1_area");
      plot2_area = $("#plot2_area");
      start_year = (new Date(2002, 0, 1)).getTime();
      next_year = (new Date((new Date()).getFullYear() + 1, 0, 1)).getTime();
      special_dates = [
        {
          time: (new Date(2003, 10, 20)).getTime(),
          label: 'Met Shelley',
          offset: 150
        }, {
          time: (new Date(2006, 1, 11)).getTime(),
          label: 'Met Tracey',
          offset: 350
        }, {
          time: (new Date(2008, 6, 1)).getTime(),
          label: 'To NYC',
          offset: 600
        }, {
          time: (new Date(2010, 10, 13)).getTime(),
          label: 'Met Kim',
          offset: 900
        }, {
          time: (new Date(2016, 7, 1)).getTime(),
          label: 'To Tucson',
          offset: 1200
        }
      ];
      markings = [];
      for (i = 0, len = special_dates.length; i < len; i++) {
        d = special_dates[i];
        markings.push({
          color: 'black',
          lineWidth: 1,
          xaxis: {
            from: d.time,
            to: d.time
          }
        });
      }
      plot1_options = {
        legend: {
          show: false
        },
        grid: {
          hoverable: true
        },
        series: {
          lines: {
            show: true
          },
          points: {
            show: true
          }
        },
        xaxis: {
          mode: 'time',
          timeformat: '%Y',
          minTickSize: [1, 'year']
        },
        selection: {
          mode: 'xy'
        }
      };
      plot2_options = {
        legend: {
          show: false
        },
        series: {
          lines: {
            show: true,
            lineWidth: 1
          },
          points: {
            show: false
          },
          shadowSize: 0
        },
        xaxis: {
          mode: 'time',
          timeformat: '%Y',
          minTickSize: [1, 'year'],
          min: start_year,
          max: next_year
        },
        grid: {
          markings: markings
        },
        selection: {
          mode: 'xy'
        }
      };
      plot1 = $.plot(plot1_area, hhh, plot1_options);
      plot2 = $.plot(plot2_area, hhh, plot2_options);
      ctx = plot2.getCanvas().getContext("2d");
      arrowhead = function(ctx, o) {
        ctx.beginPath();
        o.left += 4;
        ctx.moveTo(o.left, o.top);
        ctx.lineTo(o.left, o.top - 10);
        ctx.lineTo(o.left + 10, o.top - 5);
        ctx.lineTo(o.left, o.top);
        ctx.fillStyle = "#000";
        return ctx.fill();
      };
      for (j = 0, len1 = special_dates.length; j < len1; j++) {
        d = special_dates[j];
        o = plot2.pointOffset({
          x: d.time,
          y: d.offset
        });
        label_css = {
          position: 'absolute',
          left: (o.left + 4) + "px",
          top: o.top + "px",
          color: '#666',
          "font-size": 'smaller'
        };
        $('<div/>').html(d.label).css(label_css).appendTo(plot2_area);
        arrowhead(ctx, o);
      }
      showTooltip = function(item) {
        var contents, extra, point, tooltip_css;
        point = hhh[item.seriesIndex].data[item.dataIndex];
        extra = hhh[item.seriesIndex].meta[item.dataIndex];
        contents = point[1] + "<br/>" + (point[0].toISOString().split('T')[0]) + "<br/>" + extra[0] + "<br/>" + extra[1] + "<br/>" + extra[3];
        if (extra[2]) {
          contents += "<br/>" + extra[2];
        }
        tooltip_css = {
          position: 'absolute',
          display: 'none',
          top: item.pageY + 5,
          left: item.pageX + 5,
          border: '1px solid gray',
          padding: '2px',
          "background-color": 'silver',
          opacity: 0.8
        };
        return $("<div id=\"tooltip\"/>").html(contents).css(tooltip_css).appendTo('body').fadeIn(200);
      };
      handle_plot_hover = function(event, pos, item) {
        if (item) {
          if (previousPoint !== item.dataIndex) {
            $('#tooltip').remove();
            showTooltip(item);
            return previousPoint = item.dataIndex;
          }
        } else {
          $('#tooltip').remove();
          return previousPoint = null;
        }
      };
      plot1_area.bind("plotselected", function(event, ranges) {
        if (ranges.xaxis.to - ranges.xaxis.from < 86400 * 1000) {
          ranges.xaxis.to = ranges.xaxis.from + 86400 * 1000;
        }
        if (ranges.yaxis.to - ranges.yaxis.from < 1) {
          ranges.yaxis.to = ranges.yaxis.from + 1;
        }
        plot1 = $.plot(plot1_area, hhh, $.extend(true, {}, plot1_options, {
          xaxis: {
            min: ranges.xaxis.from,
            max: ranges.xaxis.to
          },
          yaxis: {
            min: ranges.yaxis.from,
            max: ranges.yaxis.to
          }
        }));
        return plot2.setSelection(ranges, true);
      });
      plot1_area.bind("plothover", handle_plot_hover);
      return plot2_area.bind("plotselected", function(event, ranges) {
        return plot1.setSelection(ranges);
      });
    };
    onDataReceived = function(data) {
      var date, i, len, row;
      hhh = [
        {
          data: [],
          meta: [],
          color: 'black',
          label: 'Hashes'
        }
      ];
      for (i = 0, len = data.length; i < len; i++) {
        row = data[i];
        date = new Date(row[1]);
        if (row[0] > 0) {
          hhh[0].data.push([date, row[0]]);
          hhh[0].meta.push([row[2], row[3], row[4], row[5]]);
        }
      }
      return hhh;
    };
    if (hhh.length === 0) {
      return $.getJSON('hhh.json', {}, onDataReceived).fail(function() {
        return alert("Data retrieval error!");
      }).done(replot);
    }
  });

}).call(this);
