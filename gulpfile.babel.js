import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import minifyCSS from "gulp-csso";
import del from "del";
import browserify from "gulp-browserify";
import babelify from "babelify";

sass.compiler = require("node-sass");

// gulp에서 사용할 경로들
const paths = {
  styles: {
    src: "assets/scss/styles.scss",
    dest: "src/static/styles",
    watch: "assets/scss/**/*.scss",
  },
  js: {
    src: "assets/js/main.js",
    dest: "src/static/js",
    watch: "assets/js/**/*.js",
  },
};

// 기존에 번역된 파일을 삭제하고, 새롭게 번역된 파일들로 채웁니다.
const clean = () => del(["src/static"]);

// SCSS 파일들이 어떤 식으로 바뀔 것인지에 대한 내용이 들어간 함수
const styles = () =>
  gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dest));

// js 파일들의 번역 설정
const js = () =>
  gulp
    .src(paths.js.src)
    .pipe(
      browserify({
        transform: [babelify.configure({ presets: ["@babel/preset-env"] })],
      })
    )
    .pipe(gulp.dest(paths.js.dest));

// 파일들의 변화를 바로 감지하도록 하는 task.
const watchFiles = () => {
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.js.watch, js);
};

const dev = gulp.series(clean, styles, js, watchFiles);

const build = gulp.series(clean, styles, js);

export default dev;
