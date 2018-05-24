$( () ->
    qso = []
    meta =
        id: ""
        targetid: ""
        ra: ""
        dec: ""
        redshift: ""
        zerr: ""
        zwarn: ""
        type: ""
        subtype: ""
        desi_target: ""
        mws_target: ""
        bgs_target: ""
        night: ""
        expid: ""
        tileid: ""
    pad = (n, width, z) ->
        z = z || '0'
        n = n + ''
        f = n.split "."
        n = if f.length == 2 then f[0] else n
        i = if n.length >= width then n else new Array(width - n.length + 1).join(z) + n
        if f.length == 2 then "#{n}.#{f[1]}" else i
    hms = (ra) ->
        h = Math.floor ra/15.0
        m = Math.floor ((ra/15.0) % 1) * 60.0
        s = (((((ra/15.0) % 1) * 60.0) % 1) * 60.0).toFixed(2)
        "#{pad h, 2}:#{pad m, 2}:#{pad s, 2}"
    dms = (dec) ->
        si = if dec > 0 then '+' else '-'
        d = Math.floor Math.abs(dec)
        m = Math.floor (Math.abs(dec) % 1) * 60.0
        s = ((((Math.abs(dec) % 1) * 60.0) % 1) * 60).toFixed(1)
        "#{si}#{pad d, 2}:#{pad m, 2}:#{pad s, 2}"
    replot = () ->
        $("#targetid").html(meta.targetid)
        $("#ra").html(hms(meta.ra))
        $("#dec").html(dms(meta.dec))
        $("#redshift").html("#{meta.redshift.toFixed(5)} &pm; #{meta.zerr.toFixed(5)}")
        $("#zwarn").html(meta.zwarn)
        $("#type").html(meta.type)
        $("#subtype").html(meta.subtype)
        $("#desi_target").html(meta.desi_target)
        $("#mws_target").html(meta.mws_target)
        $("#bgs_target").html(meta.bgs_target)
        $("#night").html(meta.night)
        $("#expid").html(meta.expid)
        $("#tileid").html(meta.tileid)

        # options =
        #     labels: ["Wavelength", "b"]
        #     xlabel: "Wavelength [Å]"
        #     ylabel: "Flux [10<sup>-17</sup> erg cm<sup>-2</sup> s<sup>-1</sup> Å<sup>-1</sup>]"
        #     # valueRange: [0, 100]
        #     # connectSeparatedPoints: true
        #     series:
        #         b:
        #             color: "blue"
        #             # errorBars: true
        # g = new Dygraph document.getElementById("spectrum"), qso, options
        options =
            axisLabels:
                show: true
            xaxis:
                axisLabel: "Wavelength [Å]"
            yaxis:
                axisLabel: "Flux [10<sup>-17</sup> erg cm<sup>-2</sup> s<sup>-1</sup> Å<sup>-1</sup>]"
            zoom:
                interactive: true
            pan:
                interactive: true
            series:
                shadowSize: 0
        p = $.plot $("#spectrum"), qso, options
        true

    onDataReceived = (data) ->
        for own key, value of meta
            meta[key] = data[key]
        qso = [
            {data: [], color: 'blue', label: 'b', lines: {lineWidth: 1, fill: false}, opacity: 0.5},
            {data: [], color: 'red', label: 'r', lines: {lineWidth: 1, fill: false}, opacity: 0.5},
            {data: [], color: 'magenta', label: 'z', lines: {lineWidth: 1, fill: false}, opacity: 0.5},
            {data: [], color: 'blue', id: 'upper_b', lines: {lineWidth: 0, fill: 0.3}, fillBetween: 'lower_b'},
            {data: [], color: 'red', id: 'upper_r', lines: {lineWidth: 0, fill: 0.3}, fillBetween: 'lower_r'},
            {data: [], color: 'magenta', id: 'upper_z', lines: {lineWidth: 0, fill: 0.3}, fillBetween: 'lower_z'},
            {data: [], color: 'blue', id: 'lower_b', lines: {lineWidth: 0, fill: false}},
            {data: [], color: 'red', id: 'lower_r', lines: {lineWidth: 0, fill: false}},
            {data: [], color: 'magenta', id: 'lower_z', lines: {lineWidth: 0, fill: false}}
        ]
        for s, i in ['b', 'r', 'z']
            for w, j in data[s].wavelength
                if data[s].ivar[i] > 0
                    std = 1.0 / Math.sqrt(data[s].ivar[j])
                    # qso.push [w, [data[s].flux[j], std]]
                    qso[i].data.push [w, data[s].flux[j]]
                    qso[i+3].data.push [w, data[s].flux[j] + std]
                    qso[i+6].data.push [w, data[s].flux[j] - std]
                # else
                #     qso.push [w, null]
        true
    if qso.length == 0
        # $.getJSON('http://localhost:5000/5263/1088', {}, onDataReceived).error( () -> alert("Data retrieval error!") ).complete(replot)
        $.getJSON('lib/qso.json', {}, onDataReceived).error( () -> alert("Data retrieval error!") ).complete(replot)
)
