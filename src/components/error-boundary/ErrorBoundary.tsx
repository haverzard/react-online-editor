// @ts-nocheck
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.node = this.props.children
    this.state = { error: null }
  }

  componentDidCatch(err, _) {
    this.setState({ error: err })
  }

  componentDidUpdate() {
    if (this.props.children !== this.node) {
      this.node = this.props.children
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return <pre style={{ color: 'red' }}>{this.state.error.message}</pre>
    }
    return <div>{this.props.children}</div>
  }
}