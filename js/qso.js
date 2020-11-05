$(function () {
    let qso = [
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
    let meta = {
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
    let pad = function (n, width, z) {
        z = z || "0";
        let f = n.toString().split(".");
        let i = f[0].length >= width ? f[0] : new Array(width - f[0].length + 1).join(z) + f[0];
        if (f.length === 2) {
            return i + "." + f[1];
        }
        else {
            return i;
        }
    };
    let hms = function (ra) {
        let h = Math.floor(ra / 15.0);
        let m = Math.floor(((ra / 15.0) % 1) * 60.0);
        let s = (((((ra / 15.0) % 1) * 60.0) % 1) * 60.0).toFixed(2);
        return (pad(h, 2)) + ":" + (pad(m, 2)) + ":" + (pad(s, 2));
    };
    let dms = function (dec) {
        let si = dec > 0 ? "+" : "-";
        let d = Math.floor(Math.abs(dec));
        let m = Math.floor((Math.abs(dec) % 1) * 60.0);
        let s = ((((Math.abs(dec) % 1) * 60.0) % 1) * 60).toFixed(1);
        return "" + si + (pad(d, 2)) + ":" + (pad(m, 2)) + ":" + (pad(s, 2));
    };
    let replot = function () {
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
        const options = {
            axisLabels: { show: true },
            xaxis: { axisLabel: "Wavelength [Å]" },
            yaxis: { axisLabel: "Flux [10<sup>-17</sup> erg cm<sup>-2</sup> s<sup>-1</sup> Å<sup>-1</sup>]" },
            zoom: { interactive: true },
            pan: { interactive: true },
            series: { shadowSize: 0 }
        };
        $.plot($("#spectrum"), qso, options);
    };
    let onDataReceived = function (data) {
        let key;
        for (key in meta) {
            if (!meta.hasOwnProperty(key))
                continue;
            meta[key] = data[key];
        }
        const b = ["b", "r", "z"];
        for (let i = 0; i < b.length; ++i) {
            for (let j = 0; j < data[b[i]].flux.length; ++j) {
                if (data[b[i]].ivar[j] > 0) {
                    let w = data[b[i]].w0 + j * data[b[i]].dw;
                    let std = 1.0 / Math.sqrt(data[b[i]].ivar[j]);
                    qso[i].data.push([w, data[b[i]].flux[j]]);
                    qso[i + 3].data.push([w, data[b[i]].flux[j] + std]);
                    qso[i + 6].data.push([w, data[b[i]].flux[j] - std]);
                }
            }
        }
    };
    if (qso[0].data.length === 0) {
        return $.getJSON("qso.json", {}, onDataReceived).fail(function () {
            alert("Data retrieval error!");
        }).done(replot);
    }
});
