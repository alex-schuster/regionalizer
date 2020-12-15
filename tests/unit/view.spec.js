/* eslint-disable no-undef */
import createView from '../../lib/view';
import * as render from '../../lib/render';
import * as utility from '../../lib/utility';

jest.mock('../../lib/region', () => ({
  __esModule: true,
  default: (regionName) => ({
    render: () => ({ name: regionName })
  })
}));

const mockDefinitionReader = {
  getLayoutDefinitionByName: jest.fn().mockReturnValue({
    layoutName: 'foo',
    regions: ['region1', 'region2', 'region3']
  }),
  layoutExists: jest.fn().mockReturnValue(true),
  regionExists: jest.fn().mockReturnValue(true),
  getRegionDefinitionByName: jest.fn().mockReturnValue({ foo: 'foo', bar: 123 }),
  getPersistentRegionNames: jest.fn().mockReturnValue(['region1', 'region2'])
};

test('Should return a view object with the wanted properties', () => {
  const region = createView('foo', [{ name: 'region1' }], mockDefinitionReader);
  expect(region).toHaveProperty('layoutName');
  expect(region).toHaveProperty('regions');
  expect(region).toHaveProperty('render');
});

test('Should throw an error when the layout does not exist', () => {
  const mockDefinitionReaderInexistent = {
    layoutExists: jest.fn().mockReturnValue(false)
  };
  expect(() => {
    createView('foo', [], mockDefinitionReaderInexistent);
  }).toThrow();
});

test('Should return a view rendering object', () => {
  render.renderLayout = jest.fn(() => '<div>foo</div>');
  utility.htmlToElement = jest.fn(() => document.createElement('div'));
  const layout = createView('foo', [], mockDefinitionReader);

  // Get rendering without custom data.
  const rendering = layout.render();
  expect(rendering).toHaveProperty('layout');
  expect(rendering).toHaveProperty('regions');

  // Get rendering with custom data (which is not further used here).
  const renderingWithData = layout.render({ foo: 'foo', bar: 123 });
  expect(renderingWithData).toHaveProperty('layout');
  expect(renderingWithData).toHaveProperty('regions');
});
