'use strict';

import * as assert from 'assert';
import * as fs from 'fs';

import * as sprite from './sprite';

import { IAttrs } from './interfaces';

describe('Sprite', function() {

  it('Should work with default options.', () => {
    return sprite.makeSprite('fixtures').then((result) => {
      assert.ok(result.sprite);

      assert.ok(/id="rainbow"/.test(result.sprite));
      assert.ok(/id="unicorn"/.test(result.sprite));

      assert.ok(/<!DOCTYPE svg PUBLIC/.test(result.sprite));
      assert.ok(/<svg xmlns="http:/.test(result.sprite));
      assert.ok(/<\?xml version="1\.0" encoding="iso-8859-1"\?>/.test(result.sprite));
    });
  });

  it('Should work with `inline` option.', () => {
    return sprite.makeSprite('fixtures', { inline: true }).then((result) => {
      assert.ok(result.sprite);

      assert.ok(/<svg width="0" height="0" style="position:absolute">/.test(result.sprite));
      assert.ok(/id="rainbow"/.test(result.sprite));
      assert.ok(/id="unicorn"/.test(result.sprite));

      assert.ok(!/<!DOCTYPE svg PUBLIC/.test(result.sprite));
      assert.ok(!/<svg xmlns="http:/.test(result.sprite));
      assert.ok(!/<\?xml version="1\.0" encoding="iso-8859-1"\?>/.test(result.sprite));
    });
  });

  it('Should work with `inline` option.', () => {
    const options = {
      parentAttrs: <IAttrs>{
        rainbow: 'test',
        unicorn: 0
      }
    };

    return sprite.makeSprite('fixtures', options).then((result) => {
      assert.ok(result.sprite);
      assert.ok(/rainbow="test"\sunicorn="0"/.test(result.sprite));
    });
  });

  it('Should work with `iconPrefix` & `iconSuffix` options.', () => {
    const options = {
      iconPrefix: 'prefix-',
      iconSuffix: '-suffix'
    };

    return sprite.makeSprite('fixtures', options).then((result) => {
      assert.ok(result.sprite);

      assert.ok(/id="prefix-rainbow-suffix"/.test(result.sprite));
      assert.ok(/id="prefix-unicorn-suffix"/.test(result.sprite));
    });
  });

  it('Should work with `iconAttrs` option.', () => {
    const options = {
      iconAttrs: <IAttrs>{
        rainbow: 'test',
        unicorn: 0
      }
    };

    return sprite.makeSprite('fixtures', options).then((result) => {
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
    return sprite.makeSprite('fixtures', { ignore: ['rainbow.svg'] }).then((result) => {
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
