import React from "react";
import { storiesOf } from "@storybook/react";
import { Footer, Header, PageWrapper } from "./PageWrapper";

storiesOf("PageWrapper/Header", module).add("default", () => (
  <div>
    <Header />
  </div>
));

storiesOf("PageWrapper/Footer", module).add("default", () => (
  <div>
    <Footer />
  </div>
));

storiesOf("PageWrapper/PageWrapper", module).add("default", () => (
  <div>
    <PageWrapper children={<div>Content</div>} />
  </div>
));
