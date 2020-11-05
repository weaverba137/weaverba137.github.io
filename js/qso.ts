/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../../../../local/products/node_modules/lib/node_modules/@types/flot/index.d.ts" />
type Bands = [string, string, string];

interface MetaData {
    targetid: string;
    ra: number;
    dec: number;
    redshift: number;
    zerr: number;
    zwarn: number;
    type: string;
    subtype: string;
    desi_target: string;
    mws_target: string;
    bgs_target: string;
    night: number;
    expid: number;
    tileid: number;
}

interface RawSpectrum {
    flux: number[];
    ivar: number[];
    w0: number;
    dw: number;
}

interface RawData extends MetaData {
    b: RawSpectrum;
    r: RawSpectrum;
    z: RawSpectrum;
}

// See hhh.ts for additional jquery.flot declarations.

$(
    function() {
        let qso: jquery.flot.dataSeries[] = [
            {
                data: [],
                color: "blue",
                label: "b",
                lines: {
                    lineWidth: 1,
                    fill: false
                },
                opacity: 0.5
            }, {
                data: [],
                color: "red",
                label: "r",
                lines: {
                    lineWidth: 1,
                    fill: false
                },
                opacity: 0.5
            }, {
                data: [],
                color: "magenta",
                label: "z",
                lines: {
                    lineWidth: 1,
                    fill: false
                },
                opacity: 0.5
            }, {
                data: [],
                color: "blue",
                id: "upper_b",
                lines: {
                    lineWidth: 0,
                    fill: 0.3
                },
                fillBetween: "lower_b"
            }, {
                data: [],
                color: "red",
                id: "upper_r",
                lines: {
                    lineWidth: 0,
                    fill: 0.3
                },
                fillBetween: "lower_r"
            }, {
                data: [],
                color: "magenta",
                id: "upper_z",
                lines: {
                    lineWidth: 0,
                    fill: 0.3
                },
                fillBetween: "lower_z"
            }, {
                data: [],
                color: "blue",
                id: "lower_b",
                lines: {
                    lineWidth: 0,
                    fill: false
                }
            }, {
                data: [],
                color: "red",
                id: "lower_r",
                lines: {
                    lineWidth: 0,
                    fill: false
                }
            }, {
                data: [],
                color: "magenta",
                id: "lower_z",
                lines: {
                    lineWidth: 0,
                    fill: false
                }
            }
        ];
        let meta: MetaData = {
            targetid: "",
            ra: 0,
            dec: 0,
            redshift: 0,
            zerr: 0,
            zwarn: 0,
            type: "",
            subtype: "",
            desi_target: "",
            mws_target: "",
            bgs_target: "",
            night: 0,
            expid: 0,
            tileid: 0
        };
        let pad = function(n: number | string, width: number, z?: string): string {
            z = z || "0";
            let f: string[] = n.toString().split(".");
            let i: string = f[0].length >= width ? f[0] : new Array(width - f[0].length + 1).join(z) + f[0];
            if (f.length === 2) {
                return i + "." + f[1];
            } else {
                return i;
            }
        };
        let hms = function(ra: number): string {
            let h: number = Math.floor(ra / 15.0);
            let m: number = Math.floor(((ra / 15.0) % 1) * 60.0);
            let s: string = (((((ra / 15.0) % 1) * 60.0) % 1) * 60.0).toFixed(2);
            return (pad(h, 2)) + ":" + (pad(m, 2)) + ":" + (pad(s, 2));
        };
        let dms = function(dec: number): string {
            // var d, m, s, si;
            let si: string = dec > 0 ? "+" : "-";
            let d: number = Math.floor(Math.abs(dec));
            let m: number = Math.floor((Math.abs(dec) % 1) * 60.0);
            let s: string = ((((Math.abs(dec) % 1) * 60.0) % 1) * 60).toFixed(1);
            return "" + si + (pad(d, 2)) + ":" + (pad(m, 2)) + ":" + (pad(s, 2));
        };
        let replot = function(): void {
            $("#targetid").html(meta.targetid);
            $("#ra").html(hms(meta.ra));
            $("#dec").html(dms(meta.dec));
            $("#redshift").html((meta.redshift.toFixed(5)) + " &pm; " + (meta.zerr.toFixed(5)));
            $("#zwarn").html(meta.zwarn.toString());
            $("#type").html(meta.type);
            $("#subtype").html(meta.subtype);
            $("#desi_target").html(meta.desi_target);
            $("#mws_target").html(meta.mws_target);
            $("#bgs_target").html(meta.bgs_target);
            $("#night").html(meta.night.toString());
            $("#expid").html(meta.expid.toString());
            $("#tileid").html(meta.tileid.toString());
            const options: jquery.flot.plotOptions = {
                axisLabels: {show: true},
                xaxis: {axisLabel: "Wavelength [Å]"},
                yaxis: {axisLabel: "Flux [10<sup>-17</sup> erg cm<sup>-2</sup> s<sup>-1</sup> Å<sup>-1</sup>]"},
                zoom: {interactive: true},
                pan: {interactive: true},
                series: {shadowSize: 0}
            };
            $.plot($("#spectrum"), qso, options);
        };
        let onDataReceived = function(data: RawData): void {
            let key: string;
            for (key in meta) {
                if (!meta.hasOwnProperty(key)) continue;
                meta[key] = data[key];
            }
            const b: Bands = ["b", "r", "z"];
            for (let i: number = 0; i < b.length; ++i) {
                for (let j: number = 0; j < data[b[i]].flux.length; ++j) {
                    if (data[b[i]].ivar[j] > 0) {
                        let w: number = data[b[i]].w0 + j * data[b[i]].dw;
                        let std: number = 1.0 / Math.sqrt(data[b[i]].ivar[j]);
                        qso[i].data.push([w, data[b[i]].flux[j]]);
                        qso[i + 3].data.push([w, data[b[i]].flux[j] + std]);
                        qso[i + 6].data.push([w, data[b[i]].flux[j] - std]);
                    }
                }
            }
        };
        if (qso[0].data.length === 0) {
            return $.getJSON("qso.json", {}, onDataReceived).fail(function(): void {
                alert("Data retrieval error!");
            }).done(replot);
        }
    }
);
