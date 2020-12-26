import getClassName from "..";

import buttonCss from "./Button.module.css";

const button = document.createElement("button");
const buttonLabel = document.createElement("span");

button.appendChild(buttonLabel);
buttonLabel.appendChild(document.createTextNode("Click Me"));

button.className = getClassName("Button", buttonCss, {
  color: "red",
});

buttonLabel.className = getClassName("ButtonLabel", buttonCss, {
  size: 0,
});

document.body.appendChild(button);
