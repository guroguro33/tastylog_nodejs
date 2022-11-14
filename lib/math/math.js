const roundTo = require("round-to");

const padding = (val) => {
  if (isNaN(parseFloat(val))) {
    return "-";
  }
  // 少数第２位まで四捨五入で表示させ、有効数字３桁とする（０埋め）
  return roundTo(val, 2).toPrecision(3);
};

const round = (val) => {
  // 少数第３位を四捨五入し、少数第２位まで表示
  return roundTo(val, 2);
};

module.exports = {
  padding,
  round
};