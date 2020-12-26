# CSS Operators

`Work in Progress`

A combination of a Postcss Plugin and Webpack Loader on top of CSS Modules to add operators to CSS.

---

**CSS Module**

```css
/* Button.module.css */

.Button {
  border-radius: 10px;

  (variant = primary) {
    background-color: blue;
    color: white;
  }

  (variant = secondary) {
    background-color: lightblue;
    color: blue;
  }

  (size = 100) {
    padding: 3px 6px;
  }

  (size = 200) {
    padding: 6px 12px;
  }
}
```

**Javascript**

```javascript
// React

import useCssProps from "css-operators/react";
import buttonClasses from "./Button.module.css";

function Button(props) {
  // The extra props will be deleted from the result object
  const cssProps = useCssProps("Button", buttonClasses, props);

  return <button {...cssProps} />;
}

function App() {
  return (
    <Button variant="primary" size={100}>
      Hello World
    </Button>
  );
}
```

OR

```javascript
// Vanilla

import getClassName from "css-operators";
import buttonClasses from "./Button.module.css";

const className = getClassName("Button", buttonClasses, {
  variant: "primary",
  size: 100,
});

const button = document.createElement("button");

button.className = className;
```

---

## Setup

```javascript
// postcss.config.js

// postcss-nested is a required plugin and it needs to be added after the css-operators
module.exports = {
  plugins: ["css-operators/postcss", "postcss-nested"],
};
```

```javascript
// Next.js

const injectCssOperators = require("css-operators/next");

module.exports = {
  webpack(config) {
    injectCssOperators(config);

    return config;
  },
};
```

---

## API

| Operator | Behavior                       | Description                                                       | JS Equivalent |
| -------- | ------------------------------ | ----------------------------------------------------------------- | ------------- |
| =        | Equality                       | Compare the stringfied version of two values                      | ==            |
| !=       | Inequality                     | Compare the difference of two values, transforming bools and nums | !==           |
| >        | Greater than operator          | Compare the difference of two numeric values                      | >             |
| <        | Less than operator             | Compare the difference of two numeric values                      | <             |
| >=       | Greater than or equal operator | Compare the difference of two numeric values                      | >=            |
| <=       | Less than or equal operator    | Compare the difference of two numeric values                      | <=            |

`import getClassName from "css-operators"`

```javascript
// cssKey as string - the base class of your .module.css file. The same file can have multiple of these.
// cssModule as object - the import of the .module.css file. It will be parsed on webpack to a better format.
// props as object - the props object to compare with the operators.

// className as string - returns the parsed class name;

const className = getClassName(cssKey, cssModule, props);
```

`import useCssProps from "css-operators/react"`

```javascript
// arguments as the same of getClassName function

// cssProps as object - returns a shallow copied object with the className added and the used props deleted

const cssProps = useCssProps(cssKey, cssModule, props);
```
