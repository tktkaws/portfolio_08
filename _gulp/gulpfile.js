const gulp = require("gulp"); //gulp本体

//scss
const sass = require("gulp-dart-sass"); //Dart Sass はSass公式が推奨 @use構文などが使える
const plumber = require("gulp-plumber"); // エラーが発生しても強制終了させない
const notify = require("gulp-notify"); // エラー発生時のアラート出力
const browserSync = require("browser-sync"); //ブラウザリロード

// 入出力するフォルダを指定
const srcBase = "../_static/src";
const assetsBase = "../_assets";
const distBase = "../_static/dist";

const srcPath = {
  scss: assetsBase + "/scss/**/*.scss",
  html: srcBase + "/**/*.html",
};

const distPath = {
  css: distBase + "/css/",
  html: distBase + "/",
};

/**
 * sass
 *
 */
const cssSass = () => {
  return gulp
    .src(srcPath.scss, {
      sourcemaps: true,
    })
    .pipe(
      //エラーが出ても処理を止めない
      plumber({
        errorHandler: notify.onError("Error:<%= error.message %>"),
      })
    )
    .pipe(sass({ outputStyle: "expanded" })) //指定できるキー expanded compressed
    .pipe(gulp.dest(distPath.css, { sourcemaps: "./" })) //コンパイル先
    .pipe(browserSync.stream())
    .pipe(
      notify({
        message: "Sassをコンパイルしました！",
        onLast: true,
      })
    );
};

/**
 * html
 */
const html = () => {
  return gulp.src(srcPath.html).pipe(gulp.dest(distPath.html));
};

/**
 * ローカルサーバー立ち上げ
 */
const browserSyncFunc = () => {
  browserSync.init(browserSyncOption);
};

const browserSyncOption = {
  server: distBase,
};

/**
 * リロード
 */
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

/**
 *
 * ファイル監視 ファイルの変更を検知したら、browserSyncReloadでreloadメソッドを呼び出す
 * series 順番に実行
 * watch('監視するファイル',処理)
 */
const watchFiles = () => {
  gulp.watch(srcPath.scss, gulp.series(cssSass));
  gulp.watch(srcPath.html, gulp.series(html, browserSyncReload));
};

/**
 * seriesは「順番」に実行
 * parallelは並列で実行
 */
exports.default = gulp.series(
  gulp.parallel(html, cssSass),
  gulp.parallel(watchFiles, browserSyncFunc)
);

//----------------------------------------------------------------------
//  モード
//----------------------------------------------------------------------
("use strict");

//----------------------------------------------------------------------
//  モジュール読み込み
//----------------------------------------------------------------------
// const gulp = require("gulp");
const { src, dest, series, parallel, watch } = require("gulp");

const imageMin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed"); // 追加

//----------------------------------------------------------------------
//  関数定義
//----------------------------------------------------------------------
function imagemin(done) {
  src("../_assets/img/*")
    .pipe(changed("../_static/dist/img")) // 追加
    .pipe(
      imageMin([
        pngquant({
          quality: [0.6, 0.7],
          speed: 1,
        }),
        mozjpeg({ quality: 65 }),
        imageMin.svgo(),
        imageMin.optipng(),
        imageMin.gifsicle({ optimizationLevel: 3 }),
      ])
    )
    .pipe(dest("../_static/dist/img"));

  done();
}

//----------------------------------------------------------------------
//  タスク定義
//----------------------------------------------------------------------
exports.imagemin = imagemin;

/************************************************************************/
/*  END OF FILE                                                         */
/************************************************************************/

//----------------------------------------------------------------------
// 環境構築
// cd \_gulp
// npm init -y
// npm i gulp gulp-dart-sass gulp-plumber gulp-notify browser-sync
// npm i -D gulp-imagemin@7.1.0 imagemin-mozjpeg@9.0.0 imagemin-pngquant gulp-changed

// 画像圧縮
// npx gulp imagemin

// タスクランナー
// npx gulp
//----------------------------------------------------------------------
