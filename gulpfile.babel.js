import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import minifyCSS from "gulp-csso";

sass.compiler = require("node-sass");

// gulp에서 사용할 경로들
const paths = {
  styles: {
    src: "assets/scss/styles.scss",
    dest: "src/static/styles",
    watch: "assets/scss/**.*scss",
  },
};

// SCSS 파일들이 어떤 식으로 바뀔 것인지에 대한 내용이 들어간 함수
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dest));
}

// scss파일들의 변화를 바로 감지하도록 하는 task.
function watchFiles() {
  gulp.watch(paths.styles.watch, styles);
}

const dev = gulp.series([styles, watchFiles]);

export default dev;
