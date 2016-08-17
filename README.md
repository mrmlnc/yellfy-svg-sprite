# yellfy-svg-sprite

> `svg2sprite` wrapper for easy integration into the development process.

[![Travis Status](https://travis-ci.org/mrmlnc/yellfy-svg-sprite.svg?branch=master)](https://travis-ci.org/mrmlnc/yellfy-svg-sprite)

## Install

```shell
$ npm i -D yellfy-svg-sprite
```

## Usage

```js
const svgSprite = require('yellfy-svg-sprite');

svgSprite.makeSprite('dir/containing/svg/files').then((result) => {
  console.log(result.sprite);
  // <?xml version="1.0"...

  return result.write('filepath/to/save/sprite.svg');
});
```

## Supported methods

#### `.makeSprite(sourceDir, ignore, [options])` → `result`

**ignore**

  * Type: `Array`
  * Default: `['!*.svg']`

Array glob-patterns for files that will not be added to the sprite.

**options**

See [`svg2sprite` repository](https://github.com/mrmlnc/svg2sprite#supported-options).

#### result

**sprite**

  * Return: `String`

Sprite data.

**write(filepath)**

A feature that allows you to write the resulting sprite to disk.

## Related

  * [svg2sprite](https://github.com/mrmlnc/svg2sprite)
  * [svg2sprite-cli](https://github.com/mrmlnc/svg2sprite-cli)

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/yellfy-svg-sprite/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
