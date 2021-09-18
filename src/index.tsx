import _CustomizableEditor from "./components/editor/CustomizableEditor";
import _ReactEditor from "./components/editor/ReactEditor";
import _VueEditor from "./components/editor/VueEditor";
import store from "./store";
import { withRedux } from "./utilities/redux";

export * from "./utilities/compiler";
export * from "./models/compiler";

export const CustomizableEditor = withRedux(store)(_CustomizableEditor);
export const VueEditor = withRedux(store)(_VueEditor);
export const ReactEditor = withRedux(store)(_ReactEditor);
