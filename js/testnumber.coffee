class BigNumber

    constructor: (number, precision, roundType) ->
        if number instanceof BigNumber
            @precision = number.precision
            @roundType = number.roundType
            @_s = number._s
            @_f = number._f
            @_d = number._d.slice()
            return
        @precision = if isNaN(precision = Math.abs(precision)) then BigNumber.defaultPrecision else precision
        @roundType = if isNaN(roundType = Math.abs(roundType)) then BigNumber.defaultRoundType else roundType
        #
        # Determine the sign.  As a side-effect, number is converted into a
        # string.
        #
        @_s = (number += "").charAt(0) == "-"
        #
        # Determine the number of digits in the integer part.  As a side-effect,
        # number is converted into an array of strings containing the integer
        # part and the fractional part.
        #
        @_f = ((number = number.replace(/[^\d.]/g, "").split(".", 2))[0] = number[0].replace(/^0+/, "") || "0").length
        #
        # Convert the number into an array of single-digit integers.
        #
        @_d = (+n for n in (number.join("") || "0").split(""))
        @round()

    @ROUND_HALF_EVEN = (@ROUND_HALF_DOWN = (@ROUND_HALF_UP = (@ROUND_FLOOR = (@ROUND_CEIL = (@ROUND_DOWN = (@ROUND_UP = 0) + 1) + 1) + 1) + 1) + 1) + 1
    @defaultPrecision = 40
    @defaultRoundType = @ROUND_HALF_UP

    _zeroes: (n, l, t) ->
        s = ["push", "unshift"][t or 0]
        # for(++l; --l;  n[s](0))
        n

    round: () ->
        return this if "_rounding" of this
        # var $ = BigNumber, r = this.roundType, b = this._d, d, p, n, x;
        # for(@_rounding = true; @_f > 1 && !@_d[0]; --@_f, @_d.shift());
        # for(d = @_f, p = @precision + d, n = b[p]; b.length > d && !b[b.length -1]; b.pop());
        # x = (this._s ? "-" : "") + (p - d ? "0." + this._zeroes([], p - d - 1).join("") : "") + 1;
        # if(b.length > p){
        #     n && (r == $.DOWN ? false : r == $.UP ? true : r == $.CEIL ? !this._s
        #         : r == $.FLOOR ? this._s : r == $.HALF_UP ? n >= 5 : r == $.HALF_DOWN ? n > 5
        #         : r == $.HALF_EVEN ? n >= 5 && b[p - 1] & 1 : false) && this.add(x);
        #         b.splice(p, b.length - p);
        #     }
        delete @_rounding
        @
