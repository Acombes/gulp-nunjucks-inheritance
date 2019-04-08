const path = require('path')
const fs = require('fs')
const nunjucksInheritance = require('../')
const assert = require('chai').assert;
const vfs = require('vinyl-fs')
const { describe } = require('mocha')


describe('gulp-nunjucks-inheritance', function () {
  describe('Basic inclusion', function () {
    it('Should return ["test.njk"]', function (done) {
      const root = 'test/base'
      const files = [];
      const expected = [
        path.resolve(`${root}/test.njk`),
      ]

      vfs.src(`${root}/*.njk`)
        .pipe(nunjucksInheritance({ base: root }))
        .on('data', function (file) {
          files.push(file);
        })
        .once('end', function () {
          assert.sameDeepMembers(files.map(file => path.resolve(file.history[0])), expected);
          done()
        });
    })
  })

  describe('Multiple parents with the same child', function() {
    it('Should return ["test-1.njk", "test-2.njk"]', function (done) {
      const root = 'test/multiple'
      const files = [];
      const expected = [
        path.resolve(`${root}/test-1.njk`),
        path.resolve(`${root}/test-2.njk`),
      ]

      vfs.src(`${root}/*.njk`)
        .pipe(nunjucksInheritance({ base: root }))
        .on('data', function (file) {
          files.push(file);
        })
        .once('end', function () {
          assert.sameDeepMembers(files.map(file => path.resolve(file.history[0])), expected);
          done()
        });
    })
  })

  describe('Complex dependency network', function() {
    it('Should return ["d.njk", "e.njk"]', function (done) {
      const root = 'test/complex'
      const files = [];
      const expected = [
        path.resolve(`${root}/d.njk`),
        path.resolve(`${root}/e.njk`),
      ]

      vfs.src(`${root}/*.njk`)
        .pipe(nunjucksInheritance({ base: root }))
        .on('data', function (file) {
          files.push(file);
        })
        .once('end', function () {
          assert.sameDeepMembers(files.map(file => path.resolve(file.history[0])), expected);
          done()
        });
    })
  })

  describe('Propagation from a single file', function () {
    describe('From a.njk', function () {
      it('Should return ["d.njk", "e.njk"]', function (done) {
        const root = 'test/propagation'
        const files = [];
        const expected = [
          path.resolve(`${root}/d.njk`),
          path.resolve(`${root}/e.njk`),
        ]

        vfs.src(`${root}/a.njk`)
          .pipe(nunjucksInheritance({ base: root }))
          .on('data', function (file) {
            files.push(file);
          })
          .once('end', function () {
            assert.sameDeepMembers(files.map(file => path.resolve(file.history[ 0 ])), expected);
            done()
          });
      })
    })
    describe('From c.njk', function () {
      it('Should return ["e.njk"]', function (done) {
        const root = 'test/propagation'
        const files = [];
        const expected = [
          path.resolve(`${root}/e.njk`),
        ]

        vfs.src(`${root}/c.njk`)
          .pipe(nunjucksInheritance({ base: root }))
          .on('data', function (file) {
            files.push(file);
          })
          .once('end', function () {
            assert.sameDeepMembers(files.map(file => path.resolve(file.history[ 0 ])), expected);
            done()
          });

      })
    })
  })
})
