// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import PlusIcon from "@material-ui/icons/Add";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

import * as styles from "./FileList.module.css";

export default class FileList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rename: { target: null, name: "" },
      drag: { from: null, to: null },
    };
  }

  generateNoDups = (name) => {
    let newName = name;
    const names = this.props.files;
    if (names.includes(newName)) {
      // iterate until no duplicates
      let duplicates = 1;
      while (names.includes(newName + `_${duplicates}`)) {
        duplicates++;
      }
      newName += `_${duplicates}`;
    }
    return newName;
  };

  updateFile = (name) => {
    const current = this.props.current;
    if (name !== "App" && name === current) {
      this.setState({ rename: { target: current, name: current } });
    } else {
      this.props.updateFiles({ action: "new-current", file: name });
    }
  };

  addFile = () => {
    const counts = this.props.files.length + 1;

    // generate name
    const name = this.generateNoDups(`Component${counts}`);

    this.props.updateFiles({ action: "add", file: name });
  };

  renameFile = (e) => {
    this.setState({ rename: { ...this.state.rename, name: e.target.value } });
  };

  finishRename = () => {
    let name = this.state.rename.name;
    // if it's new name
    if (name !== this.props.current) {
      name = this.generateNoDups(name);
    }
    this.setState({ rename: { target: null, name: "" } });
    this.props.updateFiles({ action: "rename", file: name });
  };

  removeFile = (name) => {
    this.props.updateFiles({ action: "delete", file: name });
  };

  shadowElement = (elm, x, y) => {
    const shadow = elm.cloneNode(true);
    shadow.style.position = "absolute";
    shadow.style.top = y + "px";
    shadow.style.left = x + "px";
    shadow.style.zIndex = 1;
    shadow.style.opacity = 0.5;
    shadow.firstChild.textContent = shadow.firstChild.textContent + " ";
    return shadow;
  };

  getText = (elm) => {
    let name = elm.textContent;
    if (elm.firstChild) name = elm.firstChild.textContent;
    if (name.length === 0) {
      if (elm.tagName === "path") {
        name = elm.parentNode.parentNode.parentNode.firstChild.textContent;
      } else if (elm.parentNode.parentNode) {
        name = elm.parentNode.parentNode.firstChild.textContent;
      }
    }
    return name;
  };

  dragCell = (e) => {
    const parent = this.state.drag.from;
    if (parent !== null) {
      const elm = this.shadowElement(parent, e.clientX, e.clientY);
      parent.previousSibling.remove();
      parent.insertAdjacentElement("beforebegin", elm);

      const els = document.querySelectorAll("body, body *");
      let name = this.getText(e.target);
      // drag into outside file container
      if (name !== this.props.current + ".js ") {
        if (name !== this.state.drag.to) {
          name = null;
          els.forEach((element) => {
            element.style.cursor = "not-allowed";
          });
        } else {
          els.forEach((element) => {
            element.style.cursor = "grabbing";
          });
        }
      } else {
        name = this.state.drag.to;
      }
      this.setState({ drag: { from: parent, to: name } });
    }
  };

  selectCell = (e) => {
    let parent = e.target.parentNode.parentNode;
    if (parent.firstChild.textContent.length === 0) {
      parent = parent.parentNode;
    }
    const elm = this.shadowElement(parent, e.clientX, e.clientY);
    parent.insertAdjacentElement("beforebegin", elm);
    this.setState({ drag: { from: parent, to: null } });
  };

  setTargeted = (e) => {
    const parent = this.state.drag.from;
    if (parent !== null) {
      let name = this.getText(e.target);
      // don't forget to remove '.js'
      if (!this.props.files.includes(name.substring(0, name.length - 3))) name = null;
      this.setState({ drag: { from: parent, to: name } });
    }
  };

  setCell = () => {
    const parent = this.state.drag.from;
    if (parent !== null) {
      parent.previousSibling.remove();

      if (this.state.drag.to !== null && this.state.drag.to.length !== 0) {
        const file = {
          from: this.state.drag.from.firstChild.textContent,
          to: this.state.drag.to,
        };
        // don't forget to remove '.js'
        this.props.updateFiles({
          action: "swap",
          file: {
            from: file.from.substring(0, file.from.length - 3),
            to: file.to.substring(0, file.to.length - 3),
          },
        });
      }

      const els = document.querySelectorAll("body, body *");
      els.forEach((element) => {
        element.style.removeProperty("cursor");
      });
      this.setState({ drag: { from: null, to: null } });
    }
  };

  componentDidMount() {
    document.body.addEventListener("mousemove", this.dragCell);
    document.body.addEventListener("mouseup", this.setCell);
  }

  componentWillUnmount() {
    console.log("unmount");
    document.body.removeEventListener("mousemove", this.dragCell);
    document.body.removeEventListener("mouseup", this.setCell);
  }

  render() {
    return (
      <div id={styles["filenameContainer"]}>
        {this.props.files.map((name) => {
          return (
            <div
              key={name}
              onMouseEnter={name !== "App" ? this.setTargeted : null}
              className={`
                ${styles["innerContainer"]}
                ${this.state.drag.to === name + ".js" ? styles["targeted"] : ""}
                ${this.props.current === name ? styles["selected"] : ""}`}
            >
              <div className={styles["filename"]} onClick={() => this.updateFile(name)}>
                {this.props.current === name && this.state.rename.target !== null ? (
                  <div className={styles["renameInputContainer"]}>
                    <input
                      value={this.state.rename.name}
                      onChange={this.renameFile}
                      onBlur={this.finishRename}
                      size={1}
                      type="text"
                      autoFocus={true}
                    />
                    <span data-value={this.state.rename.name}>.js</span>
                  </div>
                ) : (
                  name + ".js"
                )}
              </div>
              {name !== "App" && (
                <>
                  <div className={styles["dragBtn"]}>
                    <DragIndicatorIcon
                      onMouseDown={name !== "App" && this.props.current === name ? this.selectCell : null}
                    />
                  </div>
                  <div className={styles["closeBtn"]}>
                    <CloseIcon onClick={() => this.removeFile(name)} />
                  </div>
                </>
              )}
            </div>
          );
        })}

        <div className={styles["innerContainer"]} onClick={() => this.addFile()}>
          <div className={styles["addBtn"]}>
            <PlusIcon />
          </div>
        </div>
      </div>
    );
  }
}
