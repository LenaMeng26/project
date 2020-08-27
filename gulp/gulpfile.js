var gulp=require('gulp');
var sass=require('gulp-sass');
var watch=require('gulp-watch');

// 将scss解析为css
gulp.task('scss',function(done){
    gulp.src('../sass/*.scss').pipe(sass()).pipe(gulp.dest('../css'));
    done();
})

// 自动解析
gulp.task('watch-sass',function(done){
    watch('../sass/*.scss',gulp.parallel('scss'));
    done();
})