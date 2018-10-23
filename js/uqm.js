(function() {
  $(function() {
    var UQM, handle_map_click, handle_map_hover, rePlot;
    UQM = {
      stars: [],
      current_star: 82,
      positions: [
        {
          data: [],
          id: [],
          color: 'black'
        }, {
          data: [],
          id: [],
          color: 'blue'
        }, {
          data: [],
          id: [],
          color: 'red'
        }
      ],
      spoilers: false,
      plotoptions: {
        points: {
          show: true
        },
        grid: {
          hoverable: true,
          clickable: true
        },
        xaxis: {
          ticks: 11,
          min: 0,
          max: 1000
        },
        yaxis: {
          ticks: 11,
          min: 0,
          max: 1000
        }
      },
      zoomoptions: {
        points: {
          show: true
        },
        grid: {
          hoverable: true,
          clickable: true
        },
        xaxis: {
          min: 0,
          max: 150
        },
        yaxis: {
          min: 0,
          max: 150
        }
      },
      previousPoint: null,
      placeholder: $("#placeholder"),
      zoomholder: $("#zoomholder"),
      getName: function(id) {
        var n;
        n = this.stars[id];
        if (n.name) {
          return n.name + " " + n.constellation;
        } else {
          return n.constellation;
        }
      },
      getID: function(series, data) {
        return this.positions[series].id[data];
      },
      getPositions: function() {
        var i, j, len, len1, p, ref, ref1, s;
        ref = this.positions;
        for (i = 0, len = ref.length; i < len; i++) {
          p = ref[i];
          p.data = [];
          p.id = [];
        }
        ref1 = this.stars;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          s = ref1[j];
          p = 0;
          if (s.constellation === this.stars[this.current_star].constellation) {
            p = 1;
          }
          if (s.id === this.current_star) {
            p = 2;
          }
          this.positions[p].data.push(s.position);
          this.positions[p].id.push(s.id);
        }
        return this.positions;
      },
      zoomPosition: function() {
        var FloorCeil;
        FloorCeil = function(position) {
          var Ceil, Floor, foo;
          Floor = position - 75.0;
          Ceil = position + 75.0;
          if (Floor < 0) {
            Floor = 0.0;
            Ceil = 150.0;
          }
          if (Ceil > 1000.0) {
            Floor = 1000.0 - 150.0;
            Ceil = 1000.0;
          }
          return foo = {
            min: Floor,
            max: Ceil
          };
        };
        this.zoomoptions.xaxis = FloorCeil(this.stars[this.current_star].position[0]);
        this.zoomoptions.yaxis = FloorCeil(this.stars[this.current_star].position[1]);
        return this.zoomoptions;
      },
      starInfo: function() {
        var star;
        star = this.stars[this.current_star];
        $("#h3info").html("Information on " + (this.getName(this.current_star)));
        $("#dlinfo").empty();
        $('<dt/>').html("Coordinates").appendTo($("#dlinfo"));
        $('<dd/>').html(this.formatPosition(star.position)).appendTo($("#dlinfo"));
        $('<dt/>').html("Type").appendTo($("#dlinfo"));
        $('<dd/>').html(star.colour + " " + star.type).appendTo($("#dlinfo"));
        $('<dt/>').html("QuasiSpace Portal").appendTo($("#dlinfo"));
        $('<dd/>').html(this.formatPosition(star.quasi)).appendTo($("#dlinfo"));
        $('<dt/>').html("Total Mineral RU").appendTo($("#dlinfo"));
        $('<dd/>').html(star.total_minerals).appendTo($("#dlinfo"));
        $('<dt/>').html("Total Bio Units").appendTo($("#dlinfo"));
        $('<dd/>').html(star.total_bio).appendTo($("#dlinfo"));
        if (this.spoilers && (star.special != null)) {
          $('<dt/>').html("Special Feature").appendTo($("#dlinfo"));
          $('<dd/>').html(star.special).appendTo($("#dlinfo"));
        }
        return star;
      },
      planetTable: function() {
        var i, j, k, len, len1, p, planets, rowid, rowref, t, titles;
        planets = this.stars[this.current_star].planets;
        $("#tableofplanets").empty();
        titles = ['Planet', 'Type', 'Orbital Radius [AU]', 'Atmospheric Pressure [atm]', 'Temperature [&deg;C]', 'Weather Activity', 'Tectonic Activity', 'Mass [M<sub>E</sub>]', 'Radius [R<sub>E</sub>]', 'Gravity [g]', 'Rotation Period [d]', 'Axial Tilt', 'Mineral RU', 'Bio Units', 'Special Notes'];
        $("<caption/>").html("Planets of " + (this.getName(this.current_star))).appendTo($("#tableofplanets"));
        $('<thead id="theadplanets"/>').appendTo($("#tableofplanets"));
        $('<tr id="thplanets"/>').appendTo($("#theadplanets"));
        for (i = 0, len = titles.length; i < len; i++) {
          t = titles[i];
          if (t === 'Special Notes') {
            $('<th/>').addClass("special").html(t).appendTo($("#thplanets"));
          } else {
            $('<th/>').html(t).appendTo($("#thplanets"));
          }
        }
        $('<tbody id="tbodyplanets"/>').appendTo($("#tableofplanets"));
        k = 0;
        for (j = 0, len1 = planets.length; j < len1; j++) {
          p = planets[j];
          rowid = 'p' + k;
          k += 1;
          $('<tr id="' + rowid + '"></tr>').appendTo($("#tbodyplanets"));
          rowref = $('#' + rowid);
          if (p.sat != null) {
            $('<td/>').html(p.rom + p.sat).css({
              "text-align": "right"
            }).appendTo(rowref);
          } else {
            $('<td/>').html(p.rom).appendTo(rowref);
          }
          $('<td/>').html(p.typ).appendTo(rowref);
          if (p.sat != null) {
            $('<td/>').html("").appendTo(rowref);
          } else {
            $('<td/>').html(p.orb.toFixed(2)).appendTo(rowref);
          }
          $('<td/>').html(p.atm).appendTo(rowref);
          $('<td/>').html(p.tmp).appendTo(rowref);
          $('<td/>').html(p.wea).appendTo(rowref);
          $('<td/>').html(p.tec).appendTo(rowref);
          $('<td/>').html(p.mss.toFixed(2)).appendTo(rowref);
          $('<td/>').html(p.rad.toFixed(2)).appendTo(rowref);
          $('<td/>').html(p.grv.toFixed(2)).appendTo(rowref);
          $('<td/>').html(p.day.toFixed(2)).appendTo(rowref);
          $('<td/>').html(p.tlt + "&deg;").appendTo(rowref);
          $('<td/>').html(p.min).appendTo(rowref);
          $('<td/>').html(p.lif).appendTo(rowref);
          $('<td/>').addClass("special").html(p.art).appendTo(rowref);
        }
        $(".special").css({
          "display": (this.spoilers ? "table-cell" : "none")
        });
        return planets;
      },
      showTooltip: function(item, tooltipid) {
        var contents, id, tooltip_css;
        id = this.getID(item.seriesIndex, item.dataIndex);
        contents = (this.getName(id)) + " (" + (this.formatPosition(id)) + ")";
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
        return $("<div id=\"" + tooltipid + "\"/>").html(contents).css(tooltip_css).appendTo('body').fadeIn(200);
      },
      formatPosition: function(pos) {
        var formatX, pp;
        pp = pos instanceof Array ? pos : this.stars[pos].position;
        formatX = function(x) {
          var prefix;
          prefix = "";
          if (x < 10) {
            prefix += "0";
          }
          if (x < 100) {
            prefix += "0";
          }
          return prefix += x.toFixed(1);
        };
        return (formatX(pp[0])) + ":" + (formatX(pp[1]));
      }
    };
    rePlot = function() {
      var plot, plot_data, zoom, zoomoptions;
      plot_data = UQM.getPositions();
      plot = $.plot(UQM.placeholder, plot_data, UQM.plotoptions);
      zoomoptions = UQM.zoomPosition();
      return zoom = $.plot(UQM.zoomholder, plot_data, zoomoptions);
    };
    handle_map_hover = function(id) {
      return function(event, pos, item) {
        if (item) {
          if (UQM.previousPoint !== item.dataIndex) {
            $('#' + id).remove();
            UQM.showTooltip(item, id);
            return UQM.previousPoint = item.dataIndex;
          }
        } else {
          $('#' + id).remove();
          return UQM.previousPoint = null;
        }
      };
    };
    handle_map_click = function(event, pos, item) {
      var id;
      if (item) {
        id = UQM.getID(item.seriesIndex, item.dataIndex);
        UQM.current_star = id;
        rePlot();
        UQM.starInfo();
        return UQM.planetTable();
      }
    };
    UQM.placeholder.bind("plothover", handle_map_hover('tooltip'));
    UQM.zoomholder.bind("plothover", handle_map_hover('zoomtip'));
    UQM.placeholder.bind('plotclick', handle_map_click);
    UQM.zoomholder.bind('plotclick', handle_map_click);
    $(".spoiler").change(function() {
      return UQM.spoilers = $("input[name=spoiler]:checked").val() === "ON";
    }).change();
    if (UQM.stars.length === 0) {
      return $.getJSON("uqm.json", {}, function(data) {
        return UQM.stars = data;
      }).fail(function() {
        return alert("JSON error!");
      }).done(rePlot);
    }
  });

}).call(this);
