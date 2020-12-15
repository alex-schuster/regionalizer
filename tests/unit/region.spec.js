/* eslint-disable no-undef */
import createRegion from '../../lib/region';
import * as render from '../../lib/render';
import * as utility from '../../lib/utility';

const mockDefinitionReader = {
  getRegionDefinitionByName: jest.fn().mockReturnValue({
    name: 'foo',
    domElement: '#foo'
  }),
  regionExists: jest.fn().mockReturnValue(true)
};

const mockDefinitionReaderPersistent = {
  getRegionDefinitionByName: jest.fn().mockReturnValue({
    name: 'bar',
    domElement: '#bar',
    isPersistent: true
  }),
  regionExists: jest.fn().mockReturnValue(true)
};

test('Should return a region object with the wanted properties', () => {
  const region = createRegion('foo', mockDefinitionReader);
  expect(region).toHaveProperty('name');
  expect(region).toHaveProperty('query');
  expect(region).toHaveProperty('element');
  expect(region).toHaveProperty('isPersistent');
  expect(region).toHaveProperty('render');

  const persistentRegion = createRegion('foo', mockDefinitionReaderPersistent);
  expect(persistentRegion).toHaveProperty('name');
  expect(persistentRegion).toHaveProperty('query');
  expect(persistentRegion).toHaveProperty('element');
  expect(persistentRegion).toHaveProperty('isPersistent');
  expect(persistentRegion).toHaveProperty('render');
});

test('Should throw an error when the region does not exist', () => {
  const definitionReaderInexistentMock = {
    regionExists: jest.fn().mockReturnValue(false)
  };
  expect(() => {
    createRegion('foo', definitionReaderInexistentMock);
  }).toThrow();
});

test('Should return a rendered element', () => {
  // Mock the used render and utility functions.
  render.renderRegion = jest.fn(() => '<div></div>');
  utility.htmlToElement = jest.fn(() => document.createElement('div'));

  const region = createRegion('foo', mockDefinitionReader);
  const renderingExpectation = document.createElement('div');

  // Get rendering without custom data.
  expect(region.render()).toStrictEqual(renderingExpectation);

  // Get rendering with custom data.
  expect(region.render({ foo: 'foo', bar: 123 })).toStrictEqual(renderingExpectation);
});

test('Should return an already existing persistent rendering object', () => {
  // Make it exist already in the DOM.
  document.querySelector('body').innerHTML = '<div id="bar"></div>';
  const region = createRegion('bar', mockDefinitionReaderPersistent);

  // Get rendering without data only. It makes no sense to provide data to already existing
  // persistent regions.
  expect(region.render()).toStrictEqual(region.element);
});
