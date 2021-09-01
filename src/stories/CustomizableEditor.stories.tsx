import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Provider } from "react-redux";

import store from "../store";
import CustomizableEditor from "../components/editor/CustomizableEditor";

import "codemirror/lib/codemirror.css";
import "codemirror/mode/jsx/jsx";
import "codemirror/addon/edit/closebrackets";
import "codemirror/keymap/sublime";
import "codemirror/theme/shadowfox.css";

export default {
  title: "haverzard/CustomizableEditor",
  component: CustomizableEditor,
} as ComponentMeta<typeof CustomizableEditor>;

const Template: ComponentStory<typeof CustomizableEditor> = (args) => (
  <Provider store={store}>
    <CustomizableEditor {...args} />
  </Provider>
);

export const Default = Template.bind({});
Default.args = {
  code: { app: "xxx", files: {} },
  currentFile: "App",
  theme: "shadowfox",
  keyMap: "sublime",
  storageKey: "test",
};
