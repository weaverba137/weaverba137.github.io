updateBitmask = (name) ->
    chkBoxes = $("input[name=#{name}]")
    bitmask = 0
    big_two = new BigNumber 2
    big_bitmask = new BigNumber 0
    chkBoxes.each (i) ->
        if $(this).prop 'checked'
            p = parseInt $(this).val()
            bitmask += Math.pow 2, p
            big_bitmask = big_bitmask.add big_two.pow p
    $("##{name}_mask").html "#{bitmask.toString()} (0x#{bitmask.toString 16})"
    $("##{name}_bmask").html "#{big_bitmask.toString()} (0x#{big_bitmask.toBase 16})"
    big_bitmask

checkAll = (name,value) ->
    $("input[name=#{name}]").prop 'checked', value
    updateBitmask name
