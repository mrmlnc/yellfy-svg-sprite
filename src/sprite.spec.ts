'use strict';

import * as assert from 'assert';
import * as fs from 'fs';

import * as sprite from './sprite';

describe('Sprite', function() {

  it('Should work', () => {
    const options = {
      inline: true,
      clean: {
        stripComment: true
      }
    };

    return sprite.makeSprite('fixtures', ['sprite.svg'], options)
      .then((result) => {
        assert.ok(result.sprite.indexOf('<svg position=') !== -1);

        return result.write('.tmp/sprite.svg');
      })
      .then(() => {
        const expected = fs.readFileSync('fixtures/sprite.svg', 'utf-8');
        const result = fs.readFileSync('.tmp/sprite.svg', 'utf-8');

        assert.equal(result, expected.replace(/[\r\n\t]|\s{2,}/g, ''));
      });
  });

});
