'use strict';

import * as assert from 'assert';

import { readdirPromise, readFilePromise, writeFilePromise } from './io';


describe('IO', () => {

  it('Should read directory.', () => {
    return readdirPromise('fixtures', ['!*.svg']).then((files) => {
      assert.ok(files.join().indexOf('rainbow.svg') !== -1);
      assert.ok(files.join().indexOf('unicorn.svg') !== -1);
    });
  });

  it('Should read file.', () => {
    return readFilePromise('fixtures/unicorn.svg', 'utf-8').then((file) => {
      assert.ok(file.indexOf('svg') !== -1);
    });
  });

  it('Should write file.', () => {
    return writeFilePromise('.tmp/test/test.svg', 'test').then((file) => {
      return readFilePromise('.tmp/test/test.svg', 'utf-8');
    }).then((file) => {
      assert.equal(file, 'test');
    });
  });

});
