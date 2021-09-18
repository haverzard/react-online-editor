import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Provider } from "react-redux";

import { cloneStore } from "../store";
import VueEditor from "../components/editor/VueEditor";

export default {
  title: "haverzard/VueEditor",
  component: VueEditor,
} as ComponentMeta<typeof VueEditor>;

const Template: ComponentStory<typeof VueEditor> = (args) => (
  <Provider store={cloneStore()}>
    <div style={{ height: "200px" }}>
      <VueEditor {...args} />
    </div>
    <div id="test"></div>
  </Provider>
);

export const Default: any = Template.bind({});
Default.args = {
  code: {
    app:
      'const App = {\n  methods: {\n    test() {\n      console.log("hi");\n    }\n  },\n  render() {\n    return <button onClick={this.test}>Vue 3.0</button>;\n  },\n};',
    files: {},
  },
  currentFile: "App",
  storageKey: "test",
  viewerId: "test",
};
