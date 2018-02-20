(function() {
  var BigNumber;

  BigNumber = (function() {
    function BigNumber(number, precision, roundType) {
      var n;
      if (number instanceof BigNumber) {
        this.precision = number.precision;
        this.roundType = number.roundType;
        this._s = number._s;
        this._f = number._f;
        this._d = number._d.slice();
        return;
      }
      this.precision = isNaN(precision = Math.abs(precision)) ? BigNumber.defaultPrecision : precision;
      this.roundType = isNaN(roundType = Math.abs(roundType)) ? BigNumber.defaultRoundType : roundType;
      this._s = (number += "").charAt(0) === "-";
      this._f = ((number = number.replace(/[^\d.]/g, "").split(".", 2))[0] = number[0].replace(/^0+/, "") || "0").length;
      this._d = (function() {
        var i, len, ref, results;
        ref = (number.join("") || "0").split("");
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          results.push(+n);
        }
        return results;
      })();
      this.round();
    }

    BigNumber.ROUND_HALF_EVEN = (BigNumber.ROUND_HALF_DOWN = (BigNumber.ROUND_HALF_UP = (BigNumber.ROUND_FLOOR = (BigNumber.ROUND_CEIL = (BigNumber.ROUND_DOWN = (BigNumber.ROUND_UP = 0) + 1) + 1) + 1) + 1) + 1) + 1;

    BigNumber.defaultPrecision = 40;

    BigNumber.defaultRoundType = BigNumber.ROUND_HALF_UP;

    BigNumber.prototype._zeroes = function(n, l, t) {
      var s;
      s = ["push", "unshift"][t || 0];
      return n;
    };

    BigNumber.prototype.round = function() {
      if ("_rounding" in this) {
        return this;
      }
      delete this._rounding;
      return this;
    };

    return BigNumber;

  })();

}).call(this);
