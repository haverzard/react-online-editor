import React from "react";
import { bundleModule } from "../utilities/compiler";
import * as process from "process";

self["process"] = process;

function createMessage(text: string) {
  console.log("%c[Bundler]: %c%s", "color: #0FF", "color: #FF0", text);
}

createMessage("Ready for bundling!");
onmessage = (event) => {
  const { code, context, target } = event.data;
  postMessage(bundleModule(code, { context, target, allowDependencies: true }));
}