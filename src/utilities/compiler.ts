import { transform } from "@babel/standalone";

import {
  EXPORT_KEYWORD_REGEX,
  EXPORT_MODULE_GETTER_REGEX,
  REQUIRE_KEYWORD_REGEX,
  REQUIRE_MODULE_GETTER_REGEXES,
} from "../contants/compiler";
import { BundlerOption, Code, FileBundlingOption } from "../models/compiler";

import { matchOrEmpty } from "./regex";

export function initTranspile(option: FileBundlingOption) {
  const { context, fileName } = option as any;
  // Local module dependency mapping
  window[context][fileName] = {} as any;
}

export function babelTranspile(code: string) {
  return transform(code, { presets: ["es2015", "react"] }).code || "";
}

export function importModule(code: string, context: string) {
  const [ROOT_GETTER, RELATIVE_GETTER] = REQUIRE_MODULE_GETTER_REGEXES;
  return code.replaceAll(REQUIRE_KEYWORD_REGEX, (pattern: string) => {
    try {
      const packageName = matchOrEmpty(ROOT_GETTER, pattern)[1];
      return `window["${packageName}"]`;
    } catch {
      const fileName = matchOrEmpty(RELATIVE_GETTER, pattern)[1];
      return `window["${context}"]["${fileName}"] ? window["${context}"]["${fileName}"] : editorContext["${fileName}"]()`;
    }
  });
}

export function exportModule(code: string, { context, fileName }: FileBundlingOption) {
  // Replace exports init
  code = code.replace(
    'Object.defineProperty(exports, "__esModule", {\n  value: true\n});',
    `window["${context}"]["${fileName}.js"] = {}`
  );

  // Replaces `exports.<something>`
  code = code.replaceAll(EXPORT_KEYWORD_REGEX, (pattern: string) => {
    const moduleName = matchOrEmpty(EXPORT_MODULE_GETTER_REGEX, pattern)[1];
    return `window["${context}"]["${fileName}.js"]["${moduleName}"]`;
  });

  return code;
}

export function tabbed(code: string) {
  return "  " + code.replaceAll("\n", "\n  ");
}

export function packing(code: string, { context, fileName }: FileBundlingOption) {
  return `editorContext["${fileName}.js"] = () => {\n${code}\n  return window["${context}"]["${fileName}.js"]\n}`;
}

export function bundleFile(code: string, option: FileBundlingOption) {
  initTranspile(option);
  code = babelTranspile(code);
  code = exportModule(code, option);
  code = tabbed(code);
  code = packing(code, option);
  return code;
}

export function bundleModule({ app, files }: Code, option: BundlerOption) {
  const appOnly = files === undefined;
  const { context, allowDependencies } = option as any;

  delete window[context];
  window[context] = {} as any;

  let bundle = "var editorContext = {};\n";

  if (!appOnly) {
    // Iterate additional files
    Object.keys(files).forEach((name: any) => {
      bundle += "\n" + bundleFile(files[name], { context, fileName: name });
    });
  }

  // Main app file
  bundle += "\n" + transform(app, { presets: ["es2015", "react"] }).code;
  bundle += "\nrender(React.createElement(App, null))";

  if (allowDependencies) {
    // Handle package imports (replaces `require("<something>")`)
    bundle = importModule(bundle, context);
  }

  /* eslint-disable no-new-func */
  return new Function("render", "require", bundle);
}