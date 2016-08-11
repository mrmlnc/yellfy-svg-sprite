# yellfy-svg-sprite

> A very simple module to generate SVG sprites.

[![Travis Status](https://travis-ci.org/mrmlnc/yellfy-svg-sprite.svg?branch=master)](https://travis-ci.org/mrmlnc/yellfy-svg-sprite)

## Install

```shell
$ npm i -D yellfy-svg-sprite
```

## Why?

Existing solutions have many dependencies.

## Usage

```js
const svgSprite = require('yellfy-svg-sprite');

svgSprite.makeSprite('dir/containing/svg/files').then((result) => {
  console.log(result.sprite);
  // <?xml version="1.0"...

  return result.write('filepath/to/save/sprite');
});
```

## Supported options

### `makeSprite(dir, [options])` → `result`

#### Options

**ignore**

  * Type: `Array`
  * Default: `[]`

Array glob-patterns for files that will not be added to the sprite.

**parentAttrs**

  * Type: `Object`
  * Default: `{}`

The attributes that will be added to the root `svg` tag.

**inline**

  * Type: `Boolean`
  * Default: `false`

If you want to embed the sprite into your HTML source, you will want to set this
to `true` in order to prevent the creation of SVG namespace declarations and to
set some other attributes for effectively hiding the library sprite.

**iconAttrs**

  * Type: `Object`
  * Default: `{}`
  * Example: `{ viewBox: '0 0 14 14' }`

The attributes of each icon. Current attribute values will be overwritten.

**iconPrefix**

  * Type: `String`
  * Default: `''`

The name prefix for each icon.

**iconSuffix**

  * Type: `String`
  * Default: `''`

The name suffix for each icon.

#### result

**sprite**

  * Return: `String`

Sprite data.

**write(filepath)**

A feature that allows you to write the resulting sprite to disk.

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/yellfy-svg-sprite/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
