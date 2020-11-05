/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/flot/index.d.ts" />
type DateNumber = [Date, number];
type MetaString = [string, string, string, string];
type HHHString = [number, string, string, string, string, string];

interface PlotData {
    data: DateNumber[];
    meta: MetaString[];
    color: string;
    label: string;
}

interface SpecialTime {
    time: number;
    label: string;
    offset: number;
}

interface Marking {
    color: string;
    lineWidth: number;
    xaxis: {from: number, to: number};
}

interface SelectionRange {
    xaxis: {from: number, to: number};
    yaxis: {from: number, to: number};
}

declare namespace jquery.flot {
    // interface plot {
    //     setSelection(ranges: SelectionRange, preventEvent?: boolean): void;
    // }
    interface axisOptions {
        axisLabel?: string;
    }
    interface plotOptions {
        axisLabels?: {show: boolean;};
        zoom?: {interactive: boolean;};
        pan?: {interactive: boolean;};
        selection?: {mode: string;};
    }
    interface dataSeries {
        id?: string;
        opacity?: number;
        fillBetween?: string;
        meta?: MetaString[];
    }
}

$(
    function(): void {
        const special_dates: SpecialTime[] = [{
            time: (new Date(2003, 10, 20)).getTime(),
            label: 'Met S.M.',
            offset: 150
        }, {
            time: (new Date(2006, 1, 11)).getTime(),
            label: 'Met T.H.',
            offset: 350
        }, {
            time: (new Date(2008, 6, 1)).getTime(),
            label: 'To N.Y.C.',
            offset: 600
        }, {
            time: (new Date(2010, 10, 13)).getTime(),
            label: 'Met K.G.',
            offset: 900
        }, {
            time: (new Date(2012, 6, 31)).getTime(),
            label: 'To W.H.',
            offset: 1050
        }, {
            time: (new Date(2016, 7, 1)).getTime(),
            label: 'To Tucson',
            offset: 1200
        }, {
            time: (new Date(2020, 2, 17)).getTime(),
            label: 'Pandemic',
            offset: 1400
        }];
        let hhh: jquery.flot.dataSeries[] = [];
        let previousPoint: number = null;
        let replot = function(): void {
            // var arrowhead, ctx, d, handle_plot_hover, i, j, label_css, len, len1, markings, next_year, o, plot1, plot1_area, plot1_options, plot2, plot2_area, plot2_options, showTooltip, special_dates, start_year;
            let plot1_area: JQuery<HTMLElement> = $("#plot1_area");
            let plot2_area: JQuery<HTMLElement> = $("#plot2_area");
            let start_year: number = (new Date(2002, 0, 1)).getTime();
            let next_year: number = (new Date((new Date()).getFullYear() + 1, 0, 1)).getTime();
            let markings: Marking[] = [];
            for (let i: number = 0; i < special_dates.length; i++) {
                markings.push({color: 'black', lineWidth: 1, xaxis: {from: special_dates[i].time, to: special_dates[i].time}});
            }
            const plot1_options: jquery.flot.plotOptions = {
                legend: {show: false},
                grid: {hoverable: true},
                series: {
                    lines: {show: true},
                    points: {show: true}
                },
                xaxis: {
                    mode: 'time',
                    timeformat: '%Y',
                    minTickSize: [1, 'year']
                },
                selection: {mode: 'xy'}
            };
            const plot2_options: jquery.flot.plotOptions = {
                legend: {show: false},
                series: {
                    lines: {show: true, lineWidth: 1},
                    points: {show: false},
                    shadowSize: 0
                },
                xaxis: {
                    mode: 'time',
                    timeformat: '%Y',
                    minTickSize: [1, 'year'],
                    min: start_year,
                    max: next_year
                },
                grid: {markings: markings},
                selection: {mode: 'xy'}
            };
            let plot1: jquery.flot.plot = $.plot(plot1_area, hhh, plot1_options);
            let plot2: jquery.flot.plot = $.plot(plot2_area, hhh, plot2_options);
            let ctx: CanvasRenderingContext2D = plot2.getCanvas().getContext("2d");
            let arrowhead = function(ctx: CanvasRenderingContext2D, o: jquery.flot.offset): void {
                ctx.beginPath();
                o.left += 4;
                ctx.moveTo(o.left, o.top);
                ctx.lineTo(o.left, o.top - 10);
                ctx.lineTo(o.left + 10, o.top - 5);
                ctx.lineTo(o.left, o.top);
                ctx.fillStyle = "#000";
                ctx.fill();
            };
            for (let j: number = 0; j < special_dates.length; j++) {
                let o: jquery.flot.offset = plot2.pointOffset({x: special_dates[j].time, y: special_dates[j].offset});
                const label_css = {
                    position: 'absolute',
                    left: (o.left + 4) + "px",
                    top: o.top + "px",
                    color: '#666',
                    "font-size": 'smaller'
                };
                $('<div/>').html(special_dates[j].label).css(label_css).appendTo(plot2_area);
                arrowhead(ctx, o);
            }
            let showTooltip = function(item: jquery.flot.item): void {
                // var contents, extra, point, tooltip_css;
                let point: DateNumber = hhh[item.seriesIndex].data[item.dataIndex];
                let extra: MetaString = hhh[item.seriesIndex].meta[item.dataIndex];
                let contents: string = point[1] + "<br/>" + (point[0].toISOString().split('T')[0]) + "<br/>" + extra[0] + "<br/>" + extra[1] + "<br/>" + extra[3];
                if (extra[2]) contents += "<br/>" + extra[2];
                const tooltip_css = {
                    position: 'absolute',
                    display: 'none',
                    top: item.pageY + 5,
                    left: item.pageX + 5,
                    border: '1px solid gray',
                    padding: '2px',
                    "background-color": 'silver',
                    opacity: 0.8
                };
                $("<div id=\"tooltip\"/>").html(contents).css(tooltip_css).appendTo('body').fadeIn(200);
            };
            let handle_plot_hover = function(_event: JQuery.Event, _pos: jquery.flot.point, item: jquery.flot.item): void {
                if (item) {
                    if (previousPoint !== item.dataIndex) {
                        $('#tooltip').remove();
                        showTooltip(item);
                        previousPoint = item.dataIndex;
                    }
                } else {
                    $('#tooltip').remove();
                    previousPoint = null;
                }
            };
            plot1_area.bind("plotselected", function(_event: JQuery.Event, ranges: SelectionRange): void {
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
                plot2.setSelection(ranges, true);
            });
            plot1_area.bind("plothover", handle_plot_hover);
            plot2_area.bind("plotselected", function(_event: JQuery.Event, ranges: SelectionRange): void {plot1.setSelection(ranges);});
        };
        let onDataReceived = function(data: HHHString[]): void {
            hhh = [{
                data: [],
                meta: [],
                color: 'black',
                label: 'Hashes'}];
            for (let i: number  = 0; i < data.length; i++) {
                if (data[i][0] > 0) {
                    hhh[0].data.push([new Date(data[i][1]), data[i][0]]);
                    hhh[0].meta.push([data[i][2], data[i][3], data[i][4], data[i][5]]);
                }
            }
        };
        if (hhh.length === 0) {
            $.getJSON('hhh.json', {}, onDataReceived).fail(function(): void {
                alert("Data retrieval error!");
            }).done(replot);
        }
    }
);
