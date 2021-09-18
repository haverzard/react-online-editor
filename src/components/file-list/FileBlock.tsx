import React, { useState, ChangeEvent } from "react";
import CloseIcon from "@material-ui/icons/Close";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { genUniqueName } from "../../utilities/file";
import { remove, rename, view } from "../../store/fileSlice";

import * as __styles from "./FileBlock.module.css";

const styles = (__styles.default ? __styles.default : __styles);

interface FileBlockProps {
  name: string;
}

interface StaticFileBlockProps extends FileBlockProps {
  style: CSSProperties;
}

interface InteractiveFileBlockProps extends FileBlockProps {
  onDrag: any;
  onTargeted: any;
}

interface RenameState {
  target?: string;
  name: string;
}

const initialRenameState = { name: "" };

export function StaticFileBlock({ name, style }: StaticFileBlockProps) {
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

export function InteractiveFileBlock({ name, onDrag, onTargeted }: InteractiveFileBlockProps) {
  const [_rename, setRename] = useState<RenameState>(initialRenameState);
  const _files = useSelector((state: RootState) => state.files.container);
  const _current = useSelector((state: RootState) => state.files.current);
  const _drag = useSelector((state: RootState) => state.drag);
  const dispatch = useDispatch();
  const names = ["App"].concat(Object.keys(_files));

  const isDynamic = (name: string) => name !== "App" && name === _current;
  const isTargeted = (name: string) => _drag.to === name;

  const removeFile = (name: string) => dispatch(remove(name));

  const viewFile = (name: string) => dispatch(view(name));

  const updateFileState = (name: string) => {
    if (isDynamic(name)) {
      return setRename({ target: _current, name: _current });
    }
    viewFile(name);
  };

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

  return (
    <div
      key={name}
      onMouseOver={name !== "App" && _drag.from ? () => onTargeted(name) : undefined}
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
            <DragIndicatorIcon onMouseDown={isDynamic(name) ? (event) => onDrag(event, name) : undefined} />
          </div>
          <div className={styles["closeBtn"]}>
            <CloseIcon onClick={() => removeFile(name)} />
          </div>
        </>
      )}
    </div>
  );
}
