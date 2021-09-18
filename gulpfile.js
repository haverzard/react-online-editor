const gulp = require("gulp");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");

const SRC_SCRIPT_FILES = ["src/**/*.@(js|ts|tsx)", "!src/stories/**/*"];
const SRC_OTHER_FILES = ["src/**/*", "!src/**/*.@(js|ts|tsx)", "!src/stories", "!src/stories/**/*"];

function babelTranspile(module = false) {
  return babel({
    presets: [
      [
        "@babel/preset-env",
        {
          modules: module,
        },
      ],
      "@babel/preset-typescript",
      "@babel/preset-react",
    ],
  });
}

function createESMModule(done) {
  gulp.src(SRC_SCRIPT_FILES).pipe(babelTranspile()).pipe(gulp.dest("esm"));

  gulp.src(SRC_OTHER_FILES).pipe(gulp.dest("esm"));
  done();
}

function createCJSModule(done) {
  gulp
    .src(SRC_SCRIPT_FILES)
    .pipe(sourcemaps.init())
    .pipe(babelTranspile("commonjs"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("lib"));

  gulp.src(SRC_OTHER_FILES).pipe(gulp.dest("lib"));
  done();
}

exports.build = gulp.series(createESMModule, createCJSModule);
