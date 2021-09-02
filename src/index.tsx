import _CustomizableEditor from "./components/editor/CustomizableEditor";
import _ReactEditor from "./components/editor/ReactEditor";
import store from "./store";
import { withRedux } from "./utilities/redux";

export * from "./utilities/compiler";

export * from "./models/compiler";

export const CustomizableEditor = withRedux(store)(_CustomizableEditor);

export default withRedux(store)(_ReactEditor);
