var BigNumber;

BigNumber = (function() {
  function BigNumber(number, precision, roundType) {
    var i;
    if (number instanceof BigNumber) {
      for (i in {
        precision: 0,
        roundType: 0,
        _s: 0,
        _f: 0
      }) {
        this[i] = number[i];
      }
      this._d = number._d.slice();
      return;
    }
    this.precision = isNaN(precision = Math.abs(precision)) ? BigNumber.defaultPrecision : precision;
    this.roundType = isNaN(roundType = Math.abs(roundType)) ? BigNumber.defaultRoundType : roundType;
    this._s = (number += "").charAt(0) === "-";
    this._f = ((number = number.replace(/[^\d.]/g, "").split(".", 2))[0] = number[0].replace(/^0+/, "") || "0").length;
    this.round();
  }

  BigNumber.ROUND_HALF_EVEN = (BigNumber.ROUND_HALF_DOWN = (BigNumber.ROUND_HALF_UP = (BigNumber.ROUND_FLOOR = (BigNumber.ROUND_CEIL = (BigNumber.ROUND_DOWN = (BigNumber.ROUND_UP = 0) + 1) + 1) + 1) + 1) + 1) + 1;

  BigNumber.defaultPrecision = 40;

  BigNumber.defaultRoundType = BigNumber.ROUND_HALF_UP;

  BigNumber.prototype.round = function() {
    return this;
  };

  return BigNumber;

})();
