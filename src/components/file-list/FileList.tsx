import React, { useState, useEffect } from "react";
import PlusIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

import { genUniqueName } from "../../utilities/file";
import { add, swap } from "../../store/fileSlice";
import { reset, select, target, untarget } from "../../store/dragSlice";
import { RootState } from "../../store";

import { InteractiveFileBlock, StaticFileBlock } from "./FileBlock";
import * as __styles from "./FileList.module.css";

const styles = (__styles.default ? __styles.default : __styles);

function FileList() {
  const [ShadowElement, setShadowElement] = useState<JSX.Element>();
  const _files = useSelector((state: RootState) => state.files.container);
  const _drag = useSelector((state: RootState) => state.drag);
  const names = ["App"].concat(Object.keys(_files));
  const dispatch = useDispatch();

  const addFile = () => {
    const counts = names.length + 1;
    const name = genUniqueName(names, `Component${counts}`);
    dispatch(add(name));
  };

  const generateShadow = (name: string, x: number, y: number) => {
    const style: CSSProperties = {};
    style.position = "absolute";
    style.top = y + 5 + "px";
    style.left = x + 5 + "px";
    style.zIndex = 100;
    style.opacity = 0.5;
    setShadowElement(<StaticFileBlock name={name} style={style} />);
  };

  const selectCell = (event: any, name: string) => {
    const { clientX, clientY } = event;
    generateShadow(name, clientX, clientY);
    dispatch(select(name));
  };

  const targetCell = (name: string) => dispatch(target(name));

  const dragCell = (event: any) => {
    const { from } = _drag;
    if (from) {
      const { target, clientX, clientY } = event;
      generateShadow(from, clientX, clientY);

      // outside of the file container
      if (target.id === styles["screenMask"]) {
        return dispatch(untarget());
      }
    }
  };

  const applyDrag = () => {
    const { from, to } = _drag;
    if (from) {
      resetListener();
      setShadowElement(undefined);

      if (to) {
        dispatch(swap({ from, to }));
      }
      dispatch(reset());
    }
  };

  const resetListener = () => {
    document.body.removeEventListener("mousemove", dragCell);
    document.body.removeEventListener("mouseup", applyDrag);
  };

  useEffect(() => {
    const { from } = _drag;
    if (from) {
      document.body.addEventListener("mousemove", dragCell);
      document.body.addEventListener("mouseup", applyDrag);
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
          return <InteractiveFileBlock key={name} name={name} onDrag={selectCell} onTargeted={targetCell} />;
        })}

        <div className={styles["innerContainer"]} onClick={addFile}>
          <div className={styles["addBtn"]}>
            <PlusIcon />
          </div>
        </div>
      </div>
      {ShadowElement}
      {_drag.from && <div id={styles["screenMask"]}></div>}
    </>
  );
}

export default FileList;
