const JSON5 = require("json5");

const { cssOperatorsKey } = require("./config");

// configuration variables
const cssLoaderPrefix = {
  client: "___CSS_LOADER_EXPORT___.locals",
  server: "module.exports",
};

const cssLoaderSuffix = " ?= ?{(.|\n|\t)[^}][^;]*};";

const cssLoaderRegExp = {
  client: new RegExp(`${cssLoaderPrefix.client}${cssLoaderSuffix}`, "gm"),
  server: new RegExp(`${cssLoaderPrefix.server}${cssLoaderSuffix}`, "gm"),
};

module.exports = function webpackLoader(source) {
  if (typeof source !== "string") return source;

  // dev and prod builds creates different outputs
  const environment = source.startsWith("// Exports") ? "server" : "client";

  const parsedSource = source.replace(
    cssLoaderRegExp[environment],

    (match) => {
      // parse css module output to right format
      const parsedMatch = match
        .replace(`${cssLoaderPrefix[environment]} = `, "")
        .replace(";", "");

      try {
        const cssModule = JSON.parse(parsedMatch);

        const parsedCssModule = parseCssModule(cssModule);

        // filter the right props for the final object
        const cssModuleKeys = Object.keys(parsedCssModule);

        if (cssModuleKeys.length) {
          const value = { [cssOperatorsKey]: parsedCssModule };

          cssModuleKeys.forEach((key) => {
            value[key] = cssModule[key];
          });

          const parsedValue = JSON5.stringify(value, null, 2);

          return `${cssLoaderPrefix[environment]} = ${parsedValue};`;
        }
      } catch (error) {
        console.error("Error: ", error);
      }

      return match;
    }
  );

  return parsedSource;
};

const operatorRegExp = /(!=|<=|>=|=|<|>)/;

function parseCssModule(cssModule) {
  // parse the css module object to create a better shape
  const props = {};

  Object.entries(cssModule).forEach(([cssModuleKey, scopedClass]) => {
    const [cssKey, propKey] = cssModuleKey.split("|");

    if (!propKey) return;

    // get the three pieces of the operator
    const [propName, operator = "=", propValue = "true"] = propKey.split(
      operatorRegExp
    );

    // get or create the props on demand
    props[cssKey] = props[cssKey] || {};
    props[cssKey][propName] = props[cssKey][propName] || { propName };

    let currentOperator =
      props[cssKey][propName] &&
      props[cssKey][propName].operators &&
      props[cssKey][propName].operators[operator];

    if (operator === "=") {
      currentOperator = currentOperator || {};
      currentOperator[propValue] = scopedClass;
    } else {
      let parsedValue = propValue;

      // parsing bools and nums
      if (propValue === "true") {
        parsedValue = true;
      } else if (propValue === "false") {
        parsedValue = false;
      } else {
        parsedValue = Number(propValue);

        if (isNaN(parsedValue)) {
          parsedValue = propValue;
        }
      }

      currentOperator = currentOperator || { propValues: [], classNames: [] };

      currentOperator.propValues.push(parsedValue);
      currentOperator.classNames.push(scopedClass);
    }

    // only inject the operator if it exists
    if (currentOperator) {
      props[cssKey][propName].operators =
        props[cssKey][propName].operators || {};

      props[cssKey][propName].operators[operator] = currentOperator;
    }
  });

  // retrieve only the parsed results inside the keys
  let parsedCssModule = {};

  Object.entries(props).forEach(([cssKey, currentProps]) => {
    parsedCssModule[cssKey] = Object.values(currentProps);
  });

  return parsedCssModule;
}
