/* eslint-disable no-undef */
import * as nunjucks from 'nunjucks';
import { renderHead, renderLayout, renderRegion } from '../../lib/render';

jest.mock('nunjucks');

test('Should render the head', () => {
  nunjucks.render.mockImplementation(() => '<meta charset="utf-8"/>');
  const data = {
    foo: 'foo',
    bar: 123
  };

  // Render with custom data.
  expect(renderHead(data)).toBe('<meta charset="utf-8"/>');

  // Render without custom data.
  expect(renderHead()).toBe('<meta charset="utf-8"/>');
});

test('Should render a layout', () => {
  nunjucks.render.mockImplementation(() => '<div>Foo</div>');
  const data = {
    foo: 'foo',
    bar: 123
  };

  // Render with custom data.
  expect(renderLayout(data)).toBe('<div>Foo</div>');

  // Render without custom data.
  expect(renderLayout()).toBe('<div>Foo</div>');
});

test('Should render a region', () => {
  nunjucks.render.mockImplementation(() => '<div>Bar</div>');
  const data = {
    foo: 'foo',
    bar: 123
  };

  // Render with custom data.
  expect(renderRegion(data)).toBe('<div>Bar</div>');

  // Render without custom data.
  expect(renderRegion()).toBe('<div>Bar</div>');
});
