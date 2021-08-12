import React, { PropsWithChildren, ReactPropTypes } from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props: PropsWithChildren<ReactPropTypes>) {
    super(props);
    const { children } = props;
    this.state = { error: null, node: children };
  }

  componentDidCatch(err: any) {
    this.setState({ error: err });
  }

  componentDidUpdate() {
    const { children } = this.props;
    const { node } = this.state as any;
    if (children !== node) {
      this.setState({ error: null, node: children });
    }
  }

  render() {
    const { error } = this.state as any;
    if (error) {
      return <pre style={{ color: "red" }}>{error.message}</pre>;
    }
    return <div>{this.props.children}</div>;
  }
}
