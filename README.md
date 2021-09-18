# react-online-editor 

[![Web CI](https://github.com/haverzard/react-online-editor/actions/workflows/node.js.yml/badge.svg)](https://github.com/haverzard/react-online-editor/actions/workflows/node.js.yml)
![Storybook](https://raw.githubusercontent.com/storybookjs/brand/059f152ecfa4e9895380cb0e4a1f48cf80311a69/badge/badge-storybook.svg)

## Description
Write your own React Components without using Desktop IDE in React!

**react-online-editor** is a React component library that provides the ability to code and compile your React codes in a Web environment. It's not as powerful as CodeSandbox. It uses codemirror library to provide the amazing code editor UI.

**NOTE: Currently, dependency import is not supported yet**

## Why react-online-editor
- The library gives the user a lot of flexibility since it just provided the code editor and compiling ability using Babel.
- You can choose your own theme for the codemirror editor or create your own too.
- It's lightweight and has a minimal configuration.

## How it works
Using a similar idea to Webpack, it transpiles & wraps your code into a single factory function. It uses the global variable `window` in order to store the dependency map for dependency resolution. Everything is done in Javascript, and you can modify it easily.

## Requirements
- Peer Dependencies: `npm install react react-dom  react-codemirror2 codemirror`

## How to use
### React Editor
Before using it, you need to run `npm install @babel/preset-react`.

| Props                      | Type        | Description |
| -------------------------- | ----------- | ----------- |
| code                       | `Code - { code: string, files: Dictionary }` | Your React code, represented as a JSON object consisted of `app` (the main file) and `files` (file container in form of JSON object) |
| currentFile                | `string`    | The current selected file (app, etc) |
| storageKey                 | `string`    | The localStorage key for storing the code |
| codeEditorContext          | `string`    | The window key for storing the bundled code |
| viewer                     | `ReactRef`  | React reference object for rendering the React component |

Sample code:
```
import { useRef } from "react";
import { ReactEditor } from "react-online-editor";

function YourReactComponent() {
    const viewer = useRef();
    ...
    const code = { app: "function App() {\n  return <div>123</div>;\n}", files: {} };
    return <ReactEditor
            code={code}
            currentFile="App"
            viewer={viewer}
            codeEditorContext="my-react-editor" />;
}
```

### Vue Editor
Before using it, you need to run `npm install @vue/babel-plugin-jsx @vue/babel-preset-jsx @vue/babel-sugar-v-on`.

| Props                      | Type        | Description |
| -------------------------- | ----------- | ----------- |
| code                       | `Code - { code: string, files: Dictionary }` | Your Vue code, represented as a JSON object consisted of `app` (the main file) and `files` (file container in form of JSON object) |
| currentFile                | `string`    | The current selected file (app, etc) |
| storageKey                 | `string`    | The localStorage key for storing the code |
| codeEditorContext          | `string`    | The window key for storing the bundled code |
| viewerId                   | `string`    | Document ID for rendering the Vue component |

Sample code:
```
import { useRef } from "react";
import { VueEditor } from "react-online-editor";

function YourReactComponent() {
    ...
    const code = { app: 'const App = {\n  methods: {\n    test() {\n      console.log("hi");\n    }\n  },\n  render() {\n    return <button onClick={this.test}>Vue 3.0</button>;\n  },\n};', files: {} };
    return <VueEditor
            code={code}
            currentFile="App"
            viewer="app"
            codeEditorContext="my-react-editor" />;
}
```

### Customizable Editor
Doesn't like the theme or want to support another framework/language? You can use `CustomizableEditor`

| Props                      | Type        | Description |
| -------------------------- | ----------- | ----------- |
| code                       | `Code - { code: string, files: Dictionary }` | Your Vue code, represented as a JSON object consisted of `app` (the main file) and `files` (file container in form of JSON object) |
| currentFile                | `string`    | The current selected file (app, etc) |
| storageKey                 | `string`    | The localStorage key for storing the code |
| theme                      | `string`    | CodeMirror theme |
| keyMap                     | `string`    | CodeMirror key map |
| runCode                    | `function(code: Code)`    | Process your code |

Sample code: [ReactEditor](https://github.com/haverzard/react-online-editor/blob/master/src/components/editor/ReactEditor.tsx)

## Use Cases
### React-related Coding Guides
With **react-online-editor**, you can make your coding guides more interactive since you can try to code while learning. The idea is similar to [Tour Golang](https://tour.golang.org/) and [Svelte Tutorial](https://svelte.dev/tutorial/basics).

### Simple Code Snippet Server
Similar to CodeSandbox embeddable iframe, you can also create your own code snippet server.

### Test & Experimentation
Using this library, you can test or experiment on a certain code without the need to wait for bundling.
