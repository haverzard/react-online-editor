import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Provider } from "react-redux";

import store from "../store";
import ReactEditor from "../components/editor/ReactEditor";

export default {
  title: "haverzard/ReactEditor",
  component: ReactEditor,
} as ComponentMeta<typeof ReactEditor>;

const Template: ComponentStory<typeof ReactEditor> = (args) => (
  <Provider store={store}>
    <div style={{ height: "200px" }}>
      <ReactEditor {...args} />
    </div>
  </Provider>
);

export const Default = Template.bind({});
Default.args = {
  code: { app: "var x = 123", files: {} },
  currentFile: "App",
  storageKey: "test",
};
