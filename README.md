# CSS Operators

A combination of a Postcss Plugin and Webpack Loader on top of CSS Modules to add operators to CSS.

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
