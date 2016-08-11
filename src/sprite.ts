'use strict';

import * as path from 'path';
import * as fs from 'fs';

import * as readdir from 'recursive-readdir';
import * as mkdirp from 'mkdirp';

const fullTemplate = [
  '<?xml version="1.0" encoding="iso-8859-1"?>',
  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"$attrs>$icons</svg>'
].join('');

function readdirPromise(dir: string, ignore: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(dir, ignore, (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
}

function readFilePromise(filepath: string, encode: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, encode, (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
}

function writeFilePromise(filepath: string, data: string): Promise<any> {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(filepath), (mkdirpError) => {
      if (mkdirpError) {
        reject(mkdirpError);
      }

      fs.writeFile(filepath, data, (writeError, files) => {
        if (writeError) {
          reject(writeError);
        }

        resolve(files);
      });
    });
  });
}

interface IFile {
  name: string;
  content: string;
}

export interface IAttrs {
  id?: string;
  [property: string]: string | number;
}

export interface IOptions {
  /**
   * Array glob-patterns for files that will not be added to the sprite.
   */
  ignore?: string[];
  /**
   * The attributes that will be added to the root `svg` tag.
   */
  parentAttrs?: IAttrs;
  /**
   * If you want to embed the sprite into your HTML source, you will want to set
   * this to `true` in order to prevent the creation of SVG namespace declarations
   * and to set some other attributes for effectively hiding the library sprite.
   */
  inline?: boolean;
  /**
   * The attributes of each icon. Current attribute values will be overwritten.
   */
  iconAttrs?: IAttrs;
  /**
   * The name prefix for each icon.
   */
  iconPrefix?: string;
  /**
   * The name suffix for each icon.
   */
  iconSuffix?: string;
}

export interface IResult {
  /**
   * Sprite data.
   */
  sprite: string;
  /**
   * A feature that allows you to write the resulting sprite to disk.
   */
  write: (filepath: string) => void;
}

/**
 * Creates an SVG sprite.
 *
 * @param {string} dir Directory containing SVG files.
 * @param {IOptions} [options] Module options.
 */
export function makeSprite(dir: string, options?: IOptions): Promise<IResult> {
  if (!dir) {
    throw new Error('`dir` required');
  }

  let template = fullTemplate;

  options = Object.assign({
    ignore: [],
    parentAttrs: <IAttrs>{},
    inline: false,
    iconAttrs: <IAttrs>{},
    iconPrefix: '',
    iconSuffix: ''
  }, options);

  options.ignore.push('!*.svg');

  if (options.inline) {
    options.parentAttrs = Object.assign({
      width: 0,
      height: 0,
      style: 'position:absolute'
    }, options.parentAttrs);

    template = `<svg$attrs>$icons</svg>`;
  }

  const parentAttrs = makeAttributes(options.parentAttrs);

  template = template.replace('$attrs', parentAttrs);

  return readdirPromise(dir, options.ignore)
    .then((files) => <any>Promise.all(files.map((filepath) => {
      const name = path.basename(filepath);
      return readFilePromise(filepath, 'utf-8').then((content) => ({ name, content }));
    })))
    .then((files: IFile[]) => {
      const icons = files.map((file) => {
        file.content = stripExtraLines(file.content);
        file.content = updateAttributes(file, options);
        file.content = file.content.replace(/\<svg/g, '<symbol').replace(/\<\/svg>/g, '</symbol>');

        return file.content;
      });

      template = template.replace('$icons', icons.join(''));

      return {
        sprite: template,
        write: (filepath: string) => writeFilePromise(filepath, template)
      };
    });
}

function makeAttributes(attrs: IAttrs): string {
  let str = '';
  Object.keys(attrs).forEach((property) => {
    str += ` ${property}="${attrs[property]}"`;
  });

  return str;
}

function updateAttributes(file: IFile, options: IOptions): string {
  const attrs = options.iconAttrs;
  const name = options.iconPrefix + path.basename(file.name, '.svg') + options.iconSuffix;

  attrs.id = name;

  Object.keys(attrs).forEach((property) => {
    const regexp = new RegExp(` ${property}="([^"]+)"`, 'g');
    if (regexp.test(file.content)) {
      file.content = file.content.replace(regexp, ` ${property}="${attrs[property]}"`);
    } else {
      file.content = file.content.replace(/\<svg/g, `<svg ${property}="${attrs[property]}"`);
    }
  });

  return file.content;
}

function stripExtraLines(content: string): string {
  return content
    .replace(/\r?\n|\r|\t/g, '')
    .replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/g, '')
    .replace(/\sxmlns="http:\/\/www.w3.org\/2000\/svg"/g, '');
}
