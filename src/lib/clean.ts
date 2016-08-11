'use strict';

import { ICleanOptions } from './interfaces';

export function clean(content: string, options: ICleanOptions): string {
  content = content
    .replace(/<.*?(xml\s|dtd).*?>/g, '')
    .replace(/[\r\n\t]|\s{2,}/g, '');

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
  if (options.stripFill) {
    content = content.replace(/\s*fill(?::|=").*?[;"]/g, '');
  }
  if (options.stripStyles) {
    content = content
      .replace(/\sstyle=".*?"/g, '')
      .replace(/<style>.*<\/style>/g, '')
      .replace(/\s*fill(?::|=").*?[;"]/g, '');
  }

  return content;
}
