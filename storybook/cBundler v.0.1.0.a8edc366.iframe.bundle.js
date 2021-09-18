(()=>{var deferred,next,__webpack_modules__={"./node_modules/@babel/standalone sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@babel/standalone sync recursive",module.exports=webpackEmptyContext},"./src/workers/Bundler.worker.ts":(__unused_webpack_module,__unused_webpack___webpack_exports__,__webpack_require__)=>{"use strict";var TargetFramework,browser=__webpack_require__("./node_modules/process/browser.js"),babel=(__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js"),__webpack_require__("./node_modules/core-js/modules/es.string.replace.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.object.keys.js"),__webpack_require__("./node_modules/@babel/standalone/babel.js")),EXPORT_KEYWORD_REGEX=/exports\.[a-zA-Z]*[a-zA-Z0-9_-]*/g,EXPORT_MODULE_GETTER_REGEX=/exports\.([a-zA-Z]*[a-zA-Z0-9_-]*)/,REQUIRE_KEYWORD_REGEX=/require\("[^"]*"\)/g,REQUIRE_MODULE_GETTER_REGEXES=[/require\("([^".]*)"\)/,/require\("\.\/([^"]*)"\)/];!function(TargetFramework){TargetFramework[TargetFramework.REACT=0]="REACT",TargetFramework[TargetFramework.VUE=1]="VUE"}(TargetFramework||(TargetFramework={}));var _transpiler,_appTranspiler;__webpack_require__("./node_modules/core-js/modules/es.string.match.js");function matchOrEmpty(regex,text){return text.match(regex)||[]}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function transpileReact(code){return(0,babel.transform)(code,{presets:["es2015","react"]}).code||""}function transpileVue(code){return(0,babel.transform)(code,{presets:["es2015",__webpack_require__("./node_modules/@vue/babel-preset-jsx/dist/plugin.cjs.js")],plugins:[[__webpack_require__("./node_modules/@vue/babel-plugin-jsx/dist/index.js"),{optimize:!0}],__webpack_require__("./node_modules/@vue/babel-sugar-v-on/dist/plugin.js")]}).code||""}var transpiler=((_transpiler={})[TargetFramework.REACT]=transpileReact,_transpiler[TargetFramework.VUE]=transpileVue,_transpiler);var appTranspiler=((_appTranspiler={})[TargetFramework.REACT]=function transpileReactApp(appCode){var code="\n"+transpileReact(appCode);return code+="\nreturn React.createElement(App, null);"},_appTranspiler[TargetFramework.VUE]=function transpileVueApp(appCode){var code="\n"+transpileVue(appCode);return code+='\nreturn self["vue"].createApp(App);'},_appTranspiler);function bundleFile(code,option){return function initTranspile(option){var _ref2=option;return'self["'+_ref2.context+'"]["'+_ref2.fileName+'"] = {}'}(option),code=function packing(code,_ref){var context=_ref.context,fileName=_ref.fileName;return'editorContext["'+fileName+'.js"] = () => {\n'+code+'\n  return self["'+context+'"]["'+fileName+'.js"]\n}'}(code=function tabbed(code){return"  "+code.replaceAll("\n","\n  ")}(code=function exportModule(code,_ref3){var context=_ref3.context,fileName=_ref3.fileName;return(code=code.replace('Object.defineProperty(exports, "__esModule", {\n  value: true\n});','self["'+context+'"]["'+fileName+'.js"] = {}')).replaceAll(EXPORT_KEYWORD_REGEX,(function(pattern){var moduleName=matchOrEmpty(EXPORT_MODULE_GETTER_REGEX,pattern)[1];return'self["'+context+'"]["'+fileName+'.js"]["'+moduleName+'"]'}))}(code=transpiler[option.target](code),option)),option)}function bundleModule(_ref4,option){var app=_ref4.app,files=_ref4.files,appOnly=void 0===files,context=option.context,allowDependencies=option.allowDependencies,target=option.target,bundle='delete self["'+context+'"]; self["'+context+'"] = {}; var editorContext = {};\n';return appOnly||Object.keys(files).forEach((function(name){bundle+="\n"+bundleFile(files[name],{context,target,fileName:name})})),bundle+=appTranspiler[target](app),allowDependencies&&(bundle=function importModule(code,context){var _REQUIRE_MODULE_GETTE=_slicedToArray(REQUIRE_MODULE_GETTER_REGEXES,2),ROOT_GETTER=_REQUIRE_MODULE_GETTE[0],RELATIVE_GETTER=_REQUIRE_MODULE_GETTE[1];return code.replaceAll(REQUIRE_KEYWORD_REGEX,(function(pattern){try{return'self["'+matchOrEmpty(ROOT_GETTER,pattern)[1]+'"]'}catch(_unused){var fileName=matchOrEmpty(RELATIVE_GETTER,pattern)[1];return'self["'+context+'"]["'+fileName+'"] ? self["'+context+'"]["'+fileName+'"] : editorContext["'+fileName+'"]()'}}))}(bundle,context)),bundle}self.process=browser,function createMessage(text){console.log("%c[Bundler]: %c%s","color: #0FF","color: #FF0",text)}("Ready for bundling!"),onmessage=function onmessage(event){var _event$data=event.data,code=_event$data.code,context=_event$data.context,target=_event$data.target;postMessage(bundleModule(code,{context,target,allowDependencies:!0}))}}},__webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(void 0!==cachedModule)return cachedModule.exports;var module=__webpack_module_cache__[moduleId]={id:moduleId,loaded:!1,exports:{}};return __webpack_modules__[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}__webpack_require__.m=__webpack_modules__,__webpack_require__.x=()=>{var __webpack_exports__=__webpack_require__.O(void 0,[462,375],(()=>__webpack_require__("./src/workers/Bundler.worker.ts")));return __webpack_exports__=__webpack_require__.O(__webpack_exports__)},deferred=[],__webpack_require__.O=(result,chunkIds,fn,priority)=>{if(!chunkIds){var notFulfilled=1/0;for(i=0;i<deferred.length;i++){for(var[chunkIds,fn,priority]=deferred[i],fulfilled=!0,j=0;j<chunkIds.length;j++)(!1&priority||notFulfilled>=priority)&&Object.keys(__webpack_require__.O).every((key=>__webpack_require__.O[key](chunkIds[j])))?chunkIds.splice(j--,1):(fulfilled=!1,priority<notFulfilled&&(notFulfilled=priority));if(fulfilled){deferred.splice(i--,1);var r=fn();void 0!==r&&(result=r)}}return result}priority=priority||0;for(var i=deferred.length;i>0&&deferred[i-1][2]>priority;i--)deferred[i]=deferred[i-1];deferred[i]=[chunkIds,fn,priority]},__webpack_require__.f={},__webpack_require__.e=chunkId=>Promise.all(Object.keys(__webpack_require__.f).reduce(((promises,key)=>(__webpack_require__.f[key](chunkId,promises),promises)),[])),__webpack_require__.u=chunkId=>chunkId+"."+{375:"d7e9e59a",462:"893d4914"}[chunkId]+".iframe.bundle.js",__webpack_require__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__webpack_require__.o=(obj,prop)=>Object.prototype.hasOwnProperty.call(obj,prop),__webpack_require__.nmd=module=>(module.paths=[],module.children||(module.children=[]),module),__webpack_require__.p="",(()=>{var installedChunks={585:1};__webpack_require__.f.i=(chunkId,promises)=>{installedChunks[chunkId]||importScripts(__webpack_require__.p+__webpack_require__.u(chunkId))};var chunkLoadingGlobal=self.webpackChunkreact_online_editor=self.webpackChunkreact_online_editor||[],parentChunkLoadingFunction=chunkLoadingGlobal.push.bind(chunkLoadingGlobal);chunkLoadingGlobal.push=data=>{var[chunkIds,moreModules,runtime]=data;for(var moduleId in moreModules)__webpack_require__.o(moreModules,moduleId)&&(__webpack_require__.m[moduleId]=moreModules[moduleId]);for(runtime&&runtime(__webpack_require__);chunkIds.length;)installedChunks[chunkIds.pop()]=1;parentChunkLoadingFunction(data)}})(),next=__webpack_require__.x,__webpack_require__.x=()=>Promise.all([__webpack_require__.e(462),__webpack_require__.e(375)]).then(next);__webpack_require__.x()})();