import React from "react";
import { storiesOf } from "@storybook/react";
import Sample from "./Sample";

storiesOf("App/Sample", module).add("default", () => (
  <div>
    <Sample />
  </div>
));
