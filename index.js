const { cssOperatorsKey } = require("./config");

module.exports = function getClassName(cssKey, cssModule, props, options) {
  if (!cssModule) return "";

  let className = cssModule[cssKey] || "";

  if (
    !cssModule[cssOperatorsKey] ||
    !cssModule[cssOperatorsKey][cssKey] ||
    !props
  ) {
    return className;
  }

  cssModule[cssOperatorsKey][cssKey].forEach(({ propName, operators }) => {
    const propValue = props[propName];

    if (options && options.deleteProps) delete props[propName];

    className += getOperatorClassName(
      operators["!="],
      (value) => propValue !== value
    );

    if (propValue !== undefined) {
      if (operators["="] && operators["="][propValue] !== undefined) {
        className += ` ${operators["="][propValue]}`;
      }

      className += getOperatorClassName(
        operators["<"],
        (value) => propValue < value
      );

      className += getOperatorClassName(
        operators[">"],
        (value) => propValue > value
      );

      className += getOperatorClassName(
        operators["<="],
        (value) => propValue <= value
      );

      className += getOperatorClassName(
        operators[">="],
        (value) => propValue >= value
      );
    }
  });

  return className.trim();
};

function getOperatorClassName(operators, filter) {
  if (!operators) return "";

  return ` ${operators.classNames
    .filter((_, index) => filter(operators.propValues[index]))
    .join(" ")}`;
}
