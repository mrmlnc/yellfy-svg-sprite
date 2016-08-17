'use strict';

import * as path from 'path';
import * as fs from 'fs';

import * as mkdirp from 'mkdirp';
import * as readdir from 'recursive-readdir';
import * as svgSprite from 'svg2sprite';

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

function readFilePromise(filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
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

export function makeSprite(sourceDir: string, ignore?: string[], options?: IOptions): Promise<IResult> {
  const sprite = svgSprite.collection(options);

  return readdirPromise(sourceDir, ignore).then((files) => {
    const promises = files.map((filename) => {
      return readFilePromise(filename).then((content) => {
        const name = path.basename(filename, '.svg');
        sprite.add(name, content);
      });
    });

    return Promise.all(promises);
  }).then(() => {
    const result = sprite.compile();

    return {
      sprite: sprite.compile(),
      write: (filepath: string) => writeFilePromise(filepath, result)
    };
  });
}
