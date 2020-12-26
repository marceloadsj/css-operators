const getClassName = require(".");

module.exports = function useCssProps(
  cssKey,
  cssModule,
  { className, ...props },
  options
) {
  const parsedClassName = getClassName(cssKey, cssModule, props, {
    deleteProps: true,
    ...options,
  });

  return {
    ...props,
    className: `${className || ""} ${parsedClassName}`.trim() || undefined,
  };
};
