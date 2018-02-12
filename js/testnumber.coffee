class BigNumber
    constructor: (number, precision, roundType) ->
        if number instanceof BigNumber
            for i of precision: 0, roundType: 0, _s: 0, _f: 0
                @[i] = number[i];
            @_d = number._d.slice()
            return
        @precision = if isNaN(precision = Math.abs(precision)) then BigNumber.defaultPrecision else precision
        @roundType = if isNaN(roundType = Math.abs(roundType)) then BigNumber.defaultRoundType else roundType
        @_s = (number += "").charAt(0) == "-"
        @_f = ((number = number.replace(/[^\d.]/g, "").split(".", 2))[0] = number[0].replace(/^0+/, "") || "0").length
        # for (i = (number = @_d = (number.join("") || "0").split("")).length; i; number[--i] = +number[i]);
        @round()

    @ROUND_HALF_EVEN = (@ROUND_HALF_DOWN = (@ROUND_HALF_UP = (@ROUND_FLOOR = (@ROUND_CEIL = (@ROUND_DOWN = (@ROUND_UP = 0) + 1) + 1) + 1) + 1) + 1) + 1

    @defaultPrecision = 40
    @defaultRoundType = @ROUND_HALF_UP
    round: () ->
        @
