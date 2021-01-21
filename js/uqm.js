$(function () {
    let UQM = {
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
        getName: function (id) {
            let n = this.stars[id];
            if (n.name) {
                return n.name + " " + n.constellation;
            }
            else {
                return n.constellation;
            }
        },
        getID: function (series, data) {
            return this.positions[series].id[data];
        },
        getPositions: function () {
            for (let i = 0; i < this.positions.length; i++) {
                this.positions[i].data = [];
                this.positions[i].id = [];
            }
            for (let j = 0; j < this.stars.length; j++) {
                let p = 0;
                if (this.stars[j].constellation === this.stars[this.current_star].constellation) {
                    p = 1;
                }
                if (this.stars[j].id === this.current_star) {
                    p = 2;
                }
                this.positions[p].data.push(this.stars[j].position);
                this.positions[p].id.push(this.stars[j].id);
            }
            return this.positions;
        },
        zoomPosition: function () {
            let FloorCeil = function (position) {
                let Floor = position - 75.0;
                let Ceil = position + 75.0;
                if (Floor < 0) {
                    Floor = 0.0;
                    Ceil = 150.0;
                }
                if (Ceil > 1000.0) {
                    Floor = 1000.0 - 150.0;
                    Ceil = 1000.0;
                }
                return { min: Floor, max: Ceil };
            };
            this.zoomoptions.xaxis = FloorCeil(this.stars[this.current_star].position[0]);
            this.zoomoptions.yaxis = FloorCeil(this.stars[this.current_star].position[1]);
            return this.zoomoptions;
        },
        starInfo: function () {
            let star = this.stars[this.current_star];
            $("#h3info").html("Information on " + (this.getName(this.current_star)));
            $("#dlinfo").empty();
            $('<dt/>').addClass("col-md-3").html("Coordinates").appendTo($("#dlinfo"));
            $('<dd/>').addClass("col-md-9").html(this.formatPosition(star.position)).appendTo($("#dlinfo"));
            $('<dt/>').addClass("col-md-3").html("Type").appendTo($("#dlinfo"));
            $('<dd/>').addClass("col-md-9").html(star.colour + " " + star.type).appendTo($("#dlinfo"));
            $('<dt/>').addClass("col-md-3").html("QuasiSpace Portal").appendTo($("#dlinfo"));
            $('<dd/>').addClass("col-md-9").html(this.formatPosition(star.quasi)).appendTo($("#dlinfo"));
            $('<dt/>').addClass("col-md-3").html("Total Mineral RU").appendTo($("#dlinfo"));
            $('<dd/>').addClass("col-md-9").html("" + star.total_minerals).appendTo($("#dlinfo"));
            $('<dt/>').addClass("col-md-3").html("Total Bio Units").appendTo($("#dlinfo"));
            $('<dd/>').addClass("col-md-9").html("" + star.total_bio).appendTo($("#dlinfo"));
            if (this.spoilers && (star.special !== null)) {
                $('<dt/>').addClass("col-md-3").html("Special Feature").appendTo($("#dlinfo"));
                $('<dd/>').addClass("col-md-9").html(star.special).appendTo($("#dlinfo"));
            }
        },
        planetTable: function () {
            let planets = this.stars[this.current_star].planets;
            $("#tableofplanets").empty();
            const titles = ['Planet', 'Type', 'Orbital Radius [AU]', 'Atmospheric Pressure [atm]', 'Temperature [&deg;C]', 'Weather Activity', 'Tectonic Activity', 'Mass [M<sub>E</sub>]', 'Radius [R<sub>E</sub>]', 'Gravity [g]', 'Rotation Period [d]', 'Axial Tilt', 'Mineral RU', 'Bio Units', 'Special Notes'];
            $("<caption/>").html("Planets of " + (this.getName(this.current_star))).appendTo($("#tableofplanets"));
            $('<thead id="theadplanets"/>').appendTo($("#tableofplanets"));
            $('<tr id="thplanets"/>').appendTo($("#theadplanets"));
            for (let i = 0; i < titles.length; i++) {
                if (titles[i] === 'Special Notes') {
                    $('<th/>').addClass("special").html(titles[i]).appendTo($("#thplanets"));
                }
                else {
                    $('<th/>').html(titles[i]).appendTo($("#thplanets"));
                }
            }
            $('<tbody id="tbodyplanets"/>').appendTo($("#tableofplanets"));
            let k = 0;
            for (let j = 0; j < planets.length; j++) {
                let p = planets[j];
                let rowid = 'p' + k;
                k += 1;
                $('<tr id="' + rowid + '"></tr>').appendTo($("#tbodyplanets"));
                let rowref = $('#' + rowid);
                if (p.sat !== null) {
                    $('<td/>').html(p.rom + p.sat).css({
                        "text-align": "right"
                    }).appendTo(rowref);
                }
                else {
                    $('<td/>').html(p.rom).appendTo(rowref);
                }
                $('<td/>').html(p.typ).appendTo(rowref);
                if (p.sat != null) {
                    $('<td/>').html("").appendTo(rowref);
                }
                else {
                    $('<td/>').html(p.orb.toFixed(2)).appendTo(rowref);
                }
                $('<td/>').html(p.atm).appendTo(rowref);
                $('<td/>').html(p.tmp.toString()).appendTo(rowref);
                $('<td/>').html(p.wea.toString()).appendTo(rowref);
                $('<td/>').html(p.tec.toString()).appendTo(rowref);
                $('<td/>').html(p.mss.toFixed(2)).appendTo(rowref);
                $('<td/>').html(p.rad.toFixed(2)).appendTo(rowref);
                $('<td/>').html(p.grv.toFixed(2)).appendTo(rowref);
                $('<td/>').html(p.day.toFixed(2)).appendTo(rowref);
                $('<td/>').html(p.tlt + "&deg;").appendTo(rowref);
                $('<td/>').html(p.min.toString()).appendTo(rowref);
                $('<td/>').html(p.lif.toString()).appendTo(rowref);
                $('<td/>').addClass("special").html(p.art).appendTo(rowref);
            }
            $(".special").css({
                "display": (this.spoilers ? "table-cell" : "none")
            });
        },
        showTooltip: function (item, tooltipid) {
            let id = this.getID(item.seriesIndex, item.dataIndex);
            let contents = (this.getName(id)) + " (" + (this.formatPosition(id)) + ")";
            let tooltip_css = {
                position: 'absolute',
                display: 'none',
                top: item.pageY + 5,
                left: item.pageX + 5,
                border: '1px solid gray',
                padding: '2px',
                "background-color": 'silver',
                opacity: 0.8
            };
            $("<div id=\"" + tooltipid + "\"/>").html(contents).css(tooltip_css).appendTo('body').fadeIn(200);
        },
        formatPosition: function (pos) {
            let pp = pos instanceof Array ? pos : this.stars[pos].position;
            let formatX = function (x) {
                let prefix = "";
                if (x < 10)
                    prefix += "0";
                if (x < 100)
                    prefix += "0";
                return prefix += x.toFixed(1);
            };
            return (formatX(pp[0])) + ":" + (formatX(pp[1]));
        }
    };
    let rePlot = function () {
        let plot_data = UQM.getPositions();
        $.plot(UQM.placeholder, plot_data, UQM.plotoptions);
        let zoomoptions = UQM.zoomPosition();
        $.plot(UQM.zoomholder, plot_data, zoomoptions);
    };
    let handle_map_hover = function (id) {
        return function (_event, _pos, item) {
            if (item) {
                if (UQM.previousPoint !== item.dataIndex) {
                    $('#' + id).remove();
                    UQM.showTooltip(item, id);
                    UQM.previousPoint = item.dataIndex;
                }
            }
            else {
                $('#' + id).remove();
                UQM.previousPoint = null;
            }
        };
    };
    let handle_map_click = function (_event, _pos, item) {
        if (item) {
            let id = UQM.getID(item.seriesIndex, item.dataIndex);
            UQM.current_star = id;
            rePlot();
            UQM.starInfo();
            UQM.planetTable();
        }
    };
    UQM.placeholder.bind("plothover", handle_map_hover('tooltip'));
    UQM.zoomholder.bind("plothover", handle_map_hover('zoomtip'));
    UQM.placeholder.bind('plotclick', handle_map_click);
    UQM.zoomholder.bind('plotclick', handle_map_click);
    $(".spoiler").change(function () {
        return UQM.spoilers = $("input[name=spoiler]:checked").val() === "ON";
    }).change();
    if (UQM.stars.length === 0) {
        return $.getJSON("uqm.json", {}, function (data) {
            return UQM.stars = data;
        }).fail(function () {
            return alert("JSON error!");
        }).done(rePlot);
    }
});
