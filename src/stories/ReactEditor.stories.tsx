import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Provider } from "react-redux";

import { cloneStore } from "../store";
import ReactEditor from "../components/editor/ReactEditor";

export default {
  title: "haverzard/ReactEditor",
  component: ReactEditor,
} as ComponentMeta<typeof ReactEditor>;

const Template: ComponentStory<typeof ReactEditor> = (args) => (
  <Provider store={cloneStore()}>
    <div style={{ height: "200px" }}>
      <ReactEditor {...args} />
    </div>
  </Provider>
);

export const Default: any = Template.bind({});
Default.args = {
  code: { app: "function App() {\n  return <div>123</div>;\n}", files: {} },
  currentFile: "App",
  storageKey: "test",
};
