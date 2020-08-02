import gulp from "gulp";
import sass from "gulp-sass";

const paths = {
  styles: {
    src: "assets/scss/styles.scss",
    dest: "src/static/styles",
  },
};

// 이 파일이 어떤 식으로 바뀔 것인지에 대한 내용이 들어간 함수
export function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(gulp.dest(paths.styles.dest));
}
