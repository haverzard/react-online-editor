import React from "react";
import { ComponentStory, ComponentMeta, Story } from "@storybook/react";
import { Provider } from "react-redux";

import store from "../store";
import CustomizableEditor from "../components/editor/CustomizableEditor";

import "codemirror/mode/jsx/jsx";
import "codemirror/addon/edit/closebrackets";
import "codemirror/keymap/sublime";
import "codemirror/theme/monokai.css";

export default {
  title: "haverzard/CustomizableEditor",
  component: CustomizableEditor,
} as ComponentMeta<typeof CustomizableEditor>;

const Template: ComponentStory<typeof CustomizableEditor> = (args) => (
  <Provider store={store}>
    <div style={{ height: "200px" }}>
      <CustomizableEditor {...args} />
    </div>
  </Provider>
);

export const Default: Story<any> = Template.bind({});
Default.args = {
  code: { app: "var x = 123", files: {} },
  currentFile: "App",
  theme: "monokai",
  keyMap: "sublime",
  storageKey: "test",
  runCode: () => null,
};
