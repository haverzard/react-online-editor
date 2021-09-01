import React, { useState, ChangeEvent, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import PlusIcon from "@material-ui/icons/Add";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { useDispatch, useSelector } from "react-redux";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

import { genUniqueName } from "../../utilities/file";
import { add, remove, rename, swap, view } from "../../store/fileSlice";
import { RootState } from "../../store";

import * as styles from "./FileList.module.css";

interface RenameState {
  target?: string;
  name: string;
}

interface DragState {
  from?: string;
  to?: string;
}

interface FileBlockProps {
  name: string;
  style: CSSProperties;
}

const initialDragState = {};
const initialRenameState = { name: "" };

function FileBlock({ name, style }: FileBlockProps) {
  return (
    <div
      className={`
        ${styles["innerContainer"]}
        ${styles["selected"]}`}
      style={style}
    >
      <div className={styles["filename"]}>{name + ".js"}</div>
      <div className={styles["dragBtn"]}>
        <DragIndicatorIcon />
      </div>
      <div className={styles["closeBtn"]}>
        <CloseIcon />
      </div>
    </div>
  );
}

function FileList() {
  const [_drag, setDrag] = useState<DragState>(initialDragState);
  const [_rename, setRename] = useState<RenameState>(initialRenameState);
  const [ShadowElement, setShadowElement] = useState<JSX.Element>();
  const _files = useSelector((state: RootState) => state.files.container);
  const _current = useSelector((state: RootState) => state.files.current);
  const names = ["App"].concat(Object.keys(_files));
  const dispatch = useDispatch();

  const isDynamic = (name: string) => name !== "App" && name === _current;
  const isTargeted = (name: string) => _drag.to === name + ".js";

  const viewFile = (name: string) => dispatch(view(name));

  const resetListener = () => {
    document.body.removeEventListener("mousemove", dragCell);
    document.body.removeEventListener("mouseup", setCell);
  };

  const updateFileState = (name: string) => {
    if (isDynamic(name)) {
      return setRename({ target: _current, name: _current });
    }
    viewFile(name);
  };

  const addFile = () => {
    const counts = names.length + 1;
    const name = genUniqueName(names, `Component${counts}`);
    dispatch(add(name));
  };

  const removeFile = (name: string) => dispatch(remove(name));

  const updateNewName = (e: ChangeEvent<HTMLInputElement>) => {
    setRename({ ..._rename, name: e.target.value });
  };

  const finishRename = () => {
    let { name } = _rename;
    if (name !== _current) {
      name = genUniqueName(names, name);
    }
    setRename(initialRenameState);
    dispatch(rename(name));
  };

  const getText = (elm: any) => {
    let name = elm.textContent;
    if (elm.firstChild) name = elm.firstChild.textContent;
    if (name.length === 0) {
      if (elm.tagName === "path") {
        name = elm.parentNode.parentNode.parentNode.firstChild.textContent;
      } else if (elm.parentNode.parentNode) {
        name = elm.parentNode.parentNode.firstChild.textContent;
      }
    }
    return name.substring(0, name.length - 3);
  };

  const generateShadow = (name: string, x: number, y: number) => {
    const style: CSSProperties = {};
    style.position = "absolute";
    style.top = y + "px";
    style.left = x + "px";
    style.zIndex = 1;
    style.opacity = 0.5;
    setShadowElement(<FileBlock name={name} style={style} />);
  };

  const dragCell = (event: any) => {
    const { from, to } = _drag;
    if (from) {
      const { target, clientX, clientY } = event;
      generateShadow(from, clientX, clientY);

      const els = document.querySelectorAll("body, body *");
      const name = getText(target);
      // drag into outside file container
      if (name !== _current) {
        if (name !== to && !_files[name]) {
          els.forEach((element: any) => {
            element.style.cursor = "not-allowed";
          });
          return setDrag({ from });
        }
        els.forEach((element: any) => {
          element.style.cursor = "grabbing";
        });
        setDrag({ from, to });
      }
    }
  };

  const selectCell = (event: any, name: string) => {
    const { clientX, clientY } = event;
    generateShadow(name, clientX, clientY);
    setDrag({ from: name });
  };

  const setTargeted = (name: string) => {
    setDrag({ ..._drag, to: name });
  };

  const setCell = () => {
    const { from, to } = _drag;
    if (from) {
      resetListener();
      setShadowElement(undefined);

      if (to && to.length !== 0) {
        dispatch(swap({ from, to }));
      }

      const els = document.querySelectorAll("body, body *");
      els.forEach((element: any) => {
        element.style.removeProperty("cursor");
      });
      setDrag(initialDragState);
    }
  };

  useEffect(() => {
    const { from } = _drag;
    if (from) {
      document.body.addEventListener("mousemove", dragCell);
      document.body.addEventListener("mouseup", setCell);
      return () => {
        resetListener();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_drag]);

  return (
    <>
      <div id={styles["filenameContainer"]}>
        {names.map((name: string) => {
          return (
            <div
              key={name}
              id={name}
              onMouseOver={name !== "App" && _drag.from ? () => setTargeted(name) : undefined}
              className={`${styles["innerContainer"]}${isTargeted(name) ? " " + styles["targeted"] : ""}${
                _current === name ? " " + styles["selected"] : ""
              }`}
            >
              <div className={styles["filename"]} onClick={() => updateFileState(name)}>
                {_current === name && _rename.target ? (
                  <div className={styles["renameInputContainer"]}>
                    <input
                      value={_rename.name}
                      onChange={updateNewName}
                      onBlur={finishRename}
                      size={1}
                      type="text"
                      autoFocus={true}
                    />
                    <span data-value={_rename.name}>.js</span>
                  </div>
                ) : (
                  name + ".js"
                )}
              </div>
              {name !== "App" && (
                <>
                  <div className={styles["dragBtn"]}>
                    <DragIndicatorIcon onMouseDown={isDynamic(name) ? (event) => selectCell(event, name) : undefined} />
                  </div>
                  <div className={styles["closeBtn"]}>
                    <CloseIcon onClick={() => removeFile(name)} />
                  </div>
                </>
              )}
            </div>
          );
        })}

        <div className={styles["innerContainer"]} onClick={addFile}>
          <div className={styles["addBtn"]}>
            <PlusIcon />
          </div>
        </div>
      </div>
      {ShadowElement}
    </>
  );
}

export default FileList;
