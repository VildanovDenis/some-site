var gulp = require('gulp');
    sass = require('gulp-sass'); // подключем препроцессор SASS
    browserSync = require('browser-sync'); // Подключаем Browser Sync
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
    autoprefixer = require('gulp-autoprefixer');
    pug = require('gulp-pug');
    var jsImport = require('gulp-js-import');
    
    gulp.task('sass', function(){
        return gulp.src('app/sass/**/*.scss') // Берем все sass файлы из папки sass и дочерних, если таковые будут
            .pipe(sass())
            .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
            .pipe(gulp.dest('app/css'))
            .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
    });

    gulp.task('browser-sync', function() { // Создаем таск browser-sync
        browserSync({ // Выполняем browserSync
            server: { // Определяем параметры сервера
                baseDir: 'app' // Директория для сервера - app
            },
            notify: false // Отключаем уведомления
        });
    });

    gulp.task('html', function() {
        return gulp.src("./app/pug/index.pug")
            .pipe(pug())
            .pipe(gulp.dest("./app"))
            .pipe(browserSync.stream())
            // .pipe(browserSync.reload({ stream: true }));
      });

    gulp.task('scripts', function() {
        return gulp.src(['app/js/**/*.js'])
        .pipe(browserSync.reload({ stream: true }))
    });

    gulp.task('code', function() {
        return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
    });

    gulp.task('css-libs', function() {
        return gulp.src('app/sass/index.scss') // Выбираем файл для минификации
            .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
            .pipe(cssnano()) // Сжимаем
            .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
            .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
    });

    gulp.task('watch', function() {
        gulp.watch('app/sass/**/*.scss', gulp.parallel('sass')); // Наблюдение за sass файлами
        gulp.watch('app/*.html', gulp.parallel('code')); // Наблюдение за HTML файлами в корне проекта
        gulp.watch(['app/js/**/*.js'], gulp.parallel('scripts')); // Наблюдение за главным JS файлом и за библиотеками
    });
    gulp.task('default', gulp.parallel('sass', 'css-libs', 'browser-sync', 'watch'));