import React from "react";
import { Provider } from "react-redux";
import { Store } from "redux";

type ReactElement = React.FC<any> | React.ComponentClass | (() => JSX.Element);

export function withRedux(store: Store) {
  return (WrappedComponent: ReactElement) => (props: any) =>
    (
      <Provider store={store}>
        <WrappedComponent {...props} />
      </Provider>
    );
}
