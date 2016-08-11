'use strict';

import * as assert from 'assert';

import { clean } from './clean';

const fixtures = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="24px" height="25px" viewBox="0 0 24 25" version="1.1" xmlns=">http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
  <!-- Generator: Sketch 3.3 (11970) -- http://www.bohemiancoding.com/sketch -->
  <style>
    /* <![CDATA[ */
    circle {
      fill: orange;
      stroke: black;
      stroke-width: 10px; // Note that the value of a pixel depend on the viewBox
    }
    /* ]]> */
  </style>
  <title>add</title>
  <desc>Created with Sketch.</desc>
  <defs></defs>
  <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
    <rect id="Rectangle-14" sketch:type="MSShapeGroup" x="0" y="0" width="24" height="24" rx="2"></rect>
    <path d="M13,13 L13,19 L11,19 L11,13 L5,13 L5,11 L11,11 L11,5 L13,5 L13,11 L19,11 L19,13 L13,13 Z" id="Fill-5" fill="#000000" sketch:type="MSShapeGroup"></path>
  </g>
  <g>
  </g>
</svg>`;

describe('Clean', () => {

  it('Should strip declarations.', () => {
    const content = clean(fixtures, {});

    assert.ok(!/<.*?(xml\s|dtd).*?>/g.test(content));
  });

  it('Should strip comments.', () => {
    const content = clean(fixtures, {
      stripComment: true,
    });

    assert.ok(!/<!--.*?-->/g.test(content));
  });

  it('Should strip descriptions.', () => {
    const content = clean(fixtures, {
      stripDescription: true
    });

    assert.ok(!/<desc>.*?<\/desc>/g.test(content));
  });

  it('Should strip definitions.', () => {
    const content = clean(fixtures, {
      stripEmptyDefinition: true
    });

    assert.ok(!/<defs><\/defs>/g.test(content));
  });

  it('Should strip groups.', () => {
    const content = clean(fixtures, {
      stripEmptyGroup: true
    });

    assert.ok(!/<g><\/g>/g.test(content));
  });

  it('Should strip indent.', () => {
    const content = clean(fixtures, {
      stripIndent: true
    });

    assert.ok(!/[\r\n\t]|\s{2,}/g.test(content));
  });

  it('Should strip extra attributes.', () => {
    const content = clean(fixtures, {
      stripExtraAttributes: true
    });

    assert.ok(!/\ssketch:type=".*?"/g.test(content));
    assert.ok(!/\s(xmlns|xmlns:.*?)=".*?"/g.test(content));
  });

  it('Should strip indent.', () => {
    const content = clean(fixtures, {
      stripTitle: true
    });

    assert.ok(!/<title>.*?<\/title>/g.test(content));
  });

  it('Should strip fill.', () => {
    const content = clean(fixtures, {
      stripFill: true
    });

    assert.ok(!/\s*fill(?::|=").*?[;"]/g.test(content));
  });

  it('Should strip styles.', () => {
    const content = clean(fixtures, {
      stripStyles: true
    });

    assert.ok(!/<style(?:.|\n)*?style>/g.test(content));
    assert.ok(!/style=".*?"/g.test(content));
  });

});
