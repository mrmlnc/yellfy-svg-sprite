'use strict';

import * as assert from 'assert';
import * as fs from 'fs';

import * as sprite from './sprite';

describe('Sprite', function() {

  it('Should work with default options.', () => {
    return sprite.makeSprite('fixtures').then((result) => {
      assert.ok(result.sprite);
      assert.ok(/id="rainbow"/.test(result.sprite));
      assert.ok(/id="unicorn"/.test(result.sprite));
      assert.ok(/<\?xml version="1\.0" encoding="iso-8859-1"\?>/.test(result.sprite));
    });
  });

  it('Should work with `inline` option.', () => {
    return sprite.makeSprite('fixtures', { inline: true }).then((result) => {
      assert.ok(result.sprite);
      assert.ok(/id="rainbow"/.test(result.sprite));
      assert.ok(/id="unicorn"/.test(result.sprite));
      assert.ok(!/<\?xml version="1\.0" encoding="iso-8859-1"\?>/.test(result.sprite));
    });
  });

  it('Should work with `inline` option.', () => {
    return sprite.makeSprite('fixtures', {
      parentAttrs: {
        rainbow: 'test',
        unicorn: 0
      }
    }).then((result) => {
      assert.ok(result.sprite);
      assert.ok(/rainbow="test"\sunicorn="0"/.test(result.sprite));
    });
  });

  it('Should work with `iconPrefix` & `iconSuffix` options.', () => {
    return sprite.makeSprite('fixtures', {
      iconPrefix: 'prefix-',
      iconSuffix: '-suffix'
    }).then((result) => {
      assert.ok(result.sprite);
      assert.ok(/id="prefix-rainbow-suffix"/.test(result.sprite));
      assert.ok(/id="prefix-unicorn-suffix"/.test(result.sprite));
    });
  });

  it('Should work with `iconAttrs` option.', () => {
    return sprite.makeSprite('fixtures', {
      iconAttrs: {
        rainbow: 'test',
        unicorn: 0
      }
    }).then((result) => {
      assert.ok(result.sprite);
      assert.ok(/unicorn="0"\srainbow="test"/.test(result.sprite));
    });
  });

  it('Should overwrite existing attributes.', () => {
    return sprite.makeSprite('fixtures', {
      iconAttrs: {
        viewBox: 'test'
      }
    }).then((result) => {
      assert.ok(result.sprite);
      assert.ok(/viewBox="test"/.test(result.sprite));
    });
  });

  it('Should work with `ignore` option.', () => {
    return sprite.makeSprite('fixtures', {
      ignore: ['rainbow.svg']
    }).then((result) => {
      assert.ok(result.sprite);
      assert.ok(!/id="rainbow"/.test(result.sprite));
      assert.ok(/id="unicorn"/.test(result.sprite));
    });
  });

  it('Should write the file to disk.', () => {
    let content = null;

    return sprite.makeSprite('fixtures', { inline: true }).then((result) => {
      content = result.sprite;

      return result.write('.tmp/sprite.svg');
    }).then(() => {
      assert.equal(fs.readFileSync('.tmp/sprite.svg', 'utf-8'), content);
    });
  });

});
