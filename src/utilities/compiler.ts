import { transform } from "@babel/standalone";

import {
  EXPORT_KEYWORD_REGEX,
  EXPORT_MODULE_GETTER_REGEX,
  REQUIRE_KEYWORD_REGEX,
  REQUIRE_MODULE_GETTER_REGEXES,
} from "../contants/compiler";
import { BundlerOption, Code, FileBundlingOption, TargetFramework } from "../models/compiler";

import { matchOrEmpty } from "./regex";

export function tabbed(code: string) {
  return "  " + code.replaceAll("\n", "\n  ");
}

export function packing(code: string, { context, fileName }: FileBundlingOption) {
  return `editorContext["${fileName}.js"] = () => {\n${code}\n  return self["${context}"]["${fileName}.js"]\n}`;
}

export function initTranspile(option: FileBundlingOption) {
  const { context, fileName } = option as any;
  // Local module dependency mapping
  return `self["${context}"]["${fileName}"] = {}`;
}

export function transpileReact(code: string) {
  return transform(code, { presets: ["es2015", "react"] }).code || "";
}

export function transpileVue(code: string) {
  return (
    transform(code, {
      presets: ["es2015", require("@vue/babel-preset-jsx")],
      plugins: [[require("@vue/babel-plugin-jsx"), { optimize: true }], require("@vue/babel-sugar-v-on")],
    }).code || ""
  );
}

const transpiler = {
  [TargetFramework.REACT]: transpileReact,
  [TargetFramework.VUE]: transpileVue,
};

// NOTE: Still not stable
export function transpileVueApp(appCode: string) {
  let code = "\n" + transpileVue(appCode);
  code += '\nreturn self["vue"].createApp(App);';
  return code;
}

export function transpileReactApp(appCode: string) {
  let code = "\n" + transpileReact(appCode);
  code += "\nreturn React.createElement(App, null);";
  return code;
}

const appTranspiler = {
  [TargetFramework.REACT]: transpileReactApp,
  [TargetFramework.VUE]: transpileVueApp,
};

export function importModule(code: string, context: string) {
  const [ROOT_GETTER, RELATIVE_GETTER] = REQUIRE_MODULE_GETTER_REGEXES;
  return code.replaceAll(REQUIRE_KEYWORD_REGEX, (pattern: string) => {
    try {
      const packageName = matchOrEmpty(ROOT_GETTER, pattern)[1];
      return `self["${packageName}"]`;
    } catch {
      const fileName = matchOrEmpty(RELATIVE_GETTER, pattern)[1];
      return `self["${context}"]["${fileName}"] ? self["${context}"]["${fileName}"] : editorContext["${fileName}"]()`;
    }
  });
}

export function exportModule(code: string, { context, fileName }: FileBundlingOption) {
  // Replace exports init
  code = code.replace(
    'Object.defineProperty(exports, "__esModule", {\n  value: true\n});',
    `self["${context}"]["${fileName}.js"] = {}`
  );

  // Replaces `exports.<something>`
  code = code.replaceAll(EXPORT_KEYWORD_REGEX, (pattern: string) => {
    const moduleName = matchOrEmpty(EXPORT_MODULE_GETTER_REGEX, pattern)[1];
    return `self["${context}"]["${fileName}.js"]["${moduleName}"]`;
  });

  return code;
}

export function bundleFile(code: string, option: FileBundlingOption) {
  initTranspile(option);
  code = transpiler[option.target](code);
  code = exportModule(code, option);
  code = tabbed(code);
  code = packing(code, option);
  return code;
}

export function bundleModule({ app, files }: Code, option: BundlerOption) {
  const appOnly = files === undefined;
  const { context, allowDependencies, target } = option;

  let bundle = `delete self["${context}"]; self["${context}"] = {}; var editorContext = {};\n`;

  if (!appOnly) {
    // Iterate additional files
    Object.keys(files).forEach((name: any) => {
      bundle += "\n" + bundleFile(files[name], { context, target, fileName: name });
    });
  }

  // Main app file
  bundle += appTranspiler[target](app);

  if (allowDependencies) {
    // Handle package imports (replaces `require("<something>")`)
    bundle = importModule(bundle, context);
  }

  /* eslint-disable no-new-func */
  return bundle;
}
