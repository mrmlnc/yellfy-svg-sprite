'use strict';

import * as assert from 'assert';

import { makeAttributes, updateAttributes } from './attributes';


describe('Attributes', () => {

  it('Should make attributes string.', () => {
    const content = makeAttributes({
      one: 'two',
      two: 0
    });

    assert.equal(content, ' one="two" two="0"');
  });

  it('Should update attributes string.', () => {
    const file = {
      name: 'test',
      content: `<svg one="none" two="none"><path d=""></path></svg>`
    };

    const content = updateAttributes(file, {
      iconAttrs: {
        id: file.name,
        one: 'test',
        three: 'test'
      },
      iconPrefix: '',
      iconSuffix: ''
    });

    const expected = '<svg three="test" id="test" one="test" two="none"><path d=""></path></svg>';

    assert.equal(content, expected);
  });

});
