import Editor from "./components/editor/CustomizableEditor";
import store from "./store";
import { withRedux } from "./utilities/redux";

export * from "./utilities/compiler";

export * from "./models/compiler";

export default withRedux(store)(Editor);
