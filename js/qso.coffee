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

    replot = () ->
        $("#targetid").html(meta.targetid)
        $("#ra").html(meta.ra)
        $("#dec").html(meta.dec)
        $("#redshift").html(meta.redshift + " &pm; " + meta.zerr)
        $("#zwarn").html(meta.zwarn)
        $("#type").html(meta.type)
        $("#subtype").html(meta.subtype)
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
            {data: [], color: 'black', label: 'z', lines: {lineWidth: 1, fill: false}, opacity: 0.5},
            {data: [], color: 'blue', id: 'upper_b', lines: {lineWidth: 0, fill: 0.3}, fillBetween: 'lower_b'},
            {data: [], color: 'red', id: 'upper_r', lines: {lineWidth: 0, fill: 0.3}, fillBetween: 'lower_r'},
            {data: [], color: 'black', id: 'upper_z', lines: {lineWidth: 0, fill: 0.3}, fillBetween: 'lower_z'},
            {data: [], color: 'blue', id: 'lower_b', lines: {lineWidth: 0, fill: false}},
            {data: [], color: 'red', id: 'lower_r', lines: {lineWidth: 0, fill: false}},
            {data: [], color: 'black', id: 'lower_z', lines: {lineWidth: 0, fill: false}}
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
        $.getJSON('lib/qso.json', {}, onDataReceived).error( () -> alert("Data retrieval error!") ).complete(replot)
)
