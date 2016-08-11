'use strict';

import * as path from 'path';

import { readdirPromise, readFilePromise, writeFilePromise } from './lib/io';
import { makeAttributes, updateAttributes } from './lib/attributes';
import { clean } from './lib/clean';

import { IFile, IAttrs, IOptions, IResult, ICleanOptions } from './interfaces';

const fullTemplate = [
  '<?xml version="1.0" encoding="iso-8859-1"?>',
  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"$attrs>$icons</svg>'
].join('');

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
    iconSuffix: '',
    clean: <ICleanOptions>{}
  }, options);

  options.clean = Object.assign({
    stripComment: false,
    stripDescription: false,
    stripEmptyDefinition: false,
    stripEmptyGroup: false,
    stripIndent: false,
    stripExtraAttributes: false,
    stripTitle: false
  }, options.clean);

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
        file.content = clean(file.content, options.clean);
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
