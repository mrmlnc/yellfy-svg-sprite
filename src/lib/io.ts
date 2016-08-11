'use strict';

import * as path from 'path';
import * as fs from 'fs';

import * as readdir from 'recursive-readdir';
import * as mkdirp from 'mkdirp';

export function readdirPromise(dir: string, ignore: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readdir(dir, ignore, (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
}

export function readFilePromise(filepath: string, encode: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, encode, (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
}

export function writeFilePromise(filepath: string, data: string): Promise<any> {
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
