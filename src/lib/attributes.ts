'use strict';

import * as path from 'path';

import { IFile, IAttrs, IOptions } from './interfaces';

export function makeAttributes(attrs: IAttrs): string {
  let str = '';
  Object.keys(attrs).forEach((property) => {
    str += ` ${property}="${attrs[property]}"`;
  });

  return str;
}

export function updateAttributes(file: IFile, options: IOptions): string {
  const attrs = options.iconAttrs;
  const name = options.iconPrefix + path.basename(file.name, '.svg') + options.iconSuffix;

  attrs.id = name;

  Object.keys(attrs).forEach((property) => {
    const regexp = new RegExp(` ${property}="([^"]+)"`);
    if (regexp.test(file.content)) {
      file.content = file.content.replace(regexp, ` ${property}="${attrs[property]}"`);
    } else {
      file.content = file.content.replace(/\<svg/g, `<svg ${property}="${attrs[property]}"`);
    }
  });

  return file.content;
}
