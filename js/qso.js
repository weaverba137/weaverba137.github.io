var hasProp = {}.hasOwnProperty;

$(function() {
  var dms, hms, meta, onDataReceived, pad, qso, replot;
  qso = [];
  meta = {
    id: "",
    targetid: "",
    ra: "",
    dec: "",
    redshift: "",
    zerr: "",
    zwarn: "",
    type: "",
    subtype: "",
    desi_target: "",
    mws_target: "",
    bgs_target: "",
    night: "",
    expid: "",
    tileid: ""
  };
  pad = function(n, width, z) {
    var f, i;
    z = z || '0';
    n = n + '';
    f = n.split(".");
    i = f[0].length >= width ? f[0] : new Array(width - f[0].length + 1).join(z) + f[0];
    if (f.length === 2) {
      return i + "." + f[1];
    } else {
      return i;
    }
  };
  hms = function(ra) {
    var h, m, s;
    h = Math.floor(ra / 15.0);
    m = Math.floor(((ra / 15.0) % 1) * 60.0);
    s = (((((ra / 15.0) % 1) * 60.0) % 1) * 60.0).toFixed(2);
    return (pad(h, 2)) + ":" + (pad(m, 2)) + ":" + (pad(s, 2));
  };
  dms = function(dec) {
    var d, m, s, si;
    si = dec > 0 ? '+' : '-';
    d = Math.floor(Math.abs(dec));
    m = Math.floor((Math.abs(dec) % 1) * 60.0);
    s = ((((Math.abs(dec) % 1) * 60.0) % 1) * 60).toFixed(1);
    return "" + si + (pad(d, 2)) + ":" + (pad(m, 2)) + ":" + (pad(s, 2));
  };
  replot = function() {
    var options, p;
    $("#targetid").html(meta.targetid);
    $("#ra").html(hms(meta.ra));
    $("#dec").html(dms(meta.dec));
    $("#redshift").html((meta.redshift.toFixed(5)) + " &pm; " + (meta.zerr.toFixed(5)));
    $("#zwarn").html(meta.zwarn);
    $("#type").html(meta.type);
    $("#subtype").html(meta.subtype);
    $("#desi_target").html(meta.desi_target);
    $("#mws_target").html(meta.mws_target);
    $("#bgs_target").html(meta.bgs_target);
    $("#night").html(meta.night);
    $("#expid").html(meta.expid);
    $("#tileid").html(meta.tileid);
    options = {
      axisLabels: {
        show: true
      },
      xaxis: {
        axisLabel: "Wavelength [Å]"
      },
      yaxis: {
        axisLabel: "Flux [10<sup>-17</sup> erg cm<sup>-2</sup> s<sup>-1</sup> Å<sup>-1</sup>]"
      },
      zoom: {
        interactive: true
      },
      pan: {
        interactive: true
      },
      series: {
        shadowSize: 0
      }
    };
    p = $.plot($("#spectrum"), qso, options);
    return true;
  };
  onDataReceived = function(data) {
    var i, j, k, key, l, len, len1, ref, ref1, s, std, value, w;
    for (key in meta) {
      if (!hasProp.call(meta, key)) continue;
      value = meta[key];
      meta[key] = data[key];
    }
    qso = [
      {
        data: [],
        color: 'blue',
        label: 'b',
        lines: {
          lineWidth: 1,
          fill: false
        },
        opacity: 0.5
      }, {
        data: [],
        color: 'red',
        label: 'r',
        lines: {
          lineWidth: 1,
          fill: false
        },
        opacity: 0.5
      }, {
        data: [],
        color: 'magenta',
        label: 'z',
        lines: {
          lineWidth: 1,
          fill: false
        },
        opacity: 0.5
      }, {
        data: [],
        color: 'blue',
        id: 'upper_b',
        lines: {
          lineWidth: 0,
          fill: 0.3
        },
        fillBetween: 'lower_b'
      }, {
        data: [],
        color: 'red',
        id: 'upper_r',
        lines: {
          lineWidth: 0,
          fill: 0.3
        },
        fillBetween: 'lower_r'
      }, {
        data: [],
        color: 'magenta',
        id: 'upper_z',
        lines: {
          lineWidth: 0,
          fill: 0.3
        },
        fillBetween: 'lower_z'
      }, {
        data: [],
        color: 'blue',
        id: 'lower_b',
        lines: {
          lineWidth: 0,
          fill: false
        }
      }, {
        data: [],
        color: 'red',
        id: 'lower_r',
        lines: {
          lineWidth: 0,
          fill: false
        }
      }, {
        data: [],
        color: 'magenta',
        id: 'lower_z',
        lines: {
          lineWidth: 0,
          fill: false
        }
      }
    ];
    ref = ['b', 'r', 'z'];
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      s = ref[i];
      ref1 = data[s].wavelength;
      for (j = l = 0, len1 = ref1.length; l < len1; j = ++l) {
        w = ref1[j];
        if (data[s].ivar[i] > 0) {
          std = 1.0 / Math.sqrt(data[s].ivar[j]);
          qso[i].data.push([w, data[s].flux[j]]);
          qso[i + 3].data.push([w, data[s].flux[j] + std]);
          qso[i + 6].data.push([w, data[s].flux[j] - std]);
        }
      }
    }
    return true;
  };
  if (qso.length === 0) {
    return $.getJSON('qso.json', {}, onDataReceived).fail(function() {
      return alert("Data retrieval error!");
    }).done(replot);
  }
});
