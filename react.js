const getClassName = require(".");

module.exports = function useCssProps(
  cssKey,
  cssModule,
  { ...props },
  options
) {
  const className = `${props.className || ""} ${getClassName(
    cssKey,
    cssModule,
    props,
    { deleteProps: true, ...options }
  )}`.trim();

  return { ...props, className };
};
