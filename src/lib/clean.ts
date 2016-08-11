'use strict';

import { ICleanOptions } from './interfaces';

export function clean(content: string, options: ICleanOptions): string {
  content = content.replace(/<.*?(xml\s|dtd).*?>/g, '');

  if (options.stripIndent) {
    content = content.replace(/[\r\n\t]|\s{2,}/g, '');
  }
  if (options.stripComment) {
    content = content.replace(/<!--.*?-->/g, '');
  }
  if (options.stripEmptyDefinition) {
    content = content.replace(/<defs><\/defs>/g, '');
  }
  if (options.stripEmptyGroup) {
    content = content.replace(/<g><\/g>/g, '');
  }
  if (options.stripTitle) {
    content = content.replace(/<title>.*?<\/title>/g, '');
  }
  if (options.stripDescription) {
    content = content.replace(/<desc>.*?<\/desc>/g, '');
  }
  if (options.stripExtraAttributes) {
    content = content
      .replace(/\ssketch:type=".*?"/g, '')
      .replace(/\s(xmlns|xmlns:.*?)=".*?"/g, '');
  }

  return content;
}
