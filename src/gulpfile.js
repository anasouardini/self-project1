const { watch, dest, src, series, parallel } = require("gulp");
const sass = require("gulp-sass");
const cssbeautify = require("gulp-cssbeautify");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const webp = require("gulp-webp");
const browserSync = require("browser-sync").create();

const paths = {
  scss: "src/styles/*.scss",
  css: "build/styles/",
  imgs: "build/imgs/**/*",
};

/* //// CSS //// */
function css() {
  return src([paths.scss])
    .pipe(sass().on("error", sass.logError))
    .pipe(rename("style.css"))
    .pipe(dest(paths.css))
    .pipe(browserSync.stream());
}

/* //// IMAGES WEBP COMPRESSION //// */
exports.imgwebp = function imgwebp() {
  return src(paths.imgs).pipe(webp()).pipe(src(paths.imgs));
}


/* //// SERVE //// */
function serve() {
  browserSync.init({
    server: {
      baseDir: "./build",
      browser: "C:\\Program Files\\Firefox Developer Edition\\firefox.exe",
    }
  });

  watch("src/styles/**/*.scss", css);
  watch("build/*/*.html").on("change", browserSync.reload);
  watch("build/scripts/*.js").on("change", browserSync.reload);
}

/* //// CSS BEAUTIFY //// */
function beautify() {
    return gulp.src('build/styles/style.css')
        .pipe(cssbeautify())
        .pipe(gulp.dest('build/styles/style.css'));
}

/* //// COPY SRC //// */
function copySrc(){
  return src("src/**")
    .pipe(dest("build/src"));
}

function copySettings(){
  return src(["gulpfile.js", "package.json"])
    .pipe(dest("build/src"));
}

exports.finish = series(copySrc, copySettings);

exports.default = series(serve, beautify);
