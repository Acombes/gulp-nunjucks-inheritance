# gulp-nunjucks-inheritance
Recompile only changed Nunjucks files and their dependencies (included, extended, or imported).

## Installation

```bash
npm i gulp-nunjucks-inheritance
```

## Usage

Suggest to work with [gulp-nunjucks](https://www.npmjs.com/package/gulp-nunjucks) and [gulp-cached](https://www.npmjs.com/package/gulp-cached).

```javascript
var gulp = require('gulp');
var nunjucksInheritance = require('gulp-nunjucks-inheritance');
var nunjucks = require('nunjucks');
var cached = require('gulp-cached');
 
gulp.task('html', function() {
    return gulp.src('src/nunjucks/**/*.njk')
 
      //filter out unchanged NJK files
      .pipe(cached('njk'))
 
      //find files that use the files that have changed 
      .pipe(nunjucksInheritance({base: 'src/nunjucks'}))
 
      //process scss files 
      .pipe(nunjucks.compile())
 
      //save all the files 
      .pipe(gulp.dest('dist'));
});
```
