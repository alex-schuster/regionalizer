/* eslint-disable no-undef */
import createDefinitionReader from '../../lib/definitionReader';

const validDefs = {
  layouts: [
    {
      name: 'default',
      regions: [
        'navigation',
        'content',
        'footer'
      ]
    },
    {
      name: 'anotherLayout',
      regions: [
        'navigation',
        'content',
        'anotherRegion',
        'footer'
      ]
    }
  ],
  views: [
    {
      name: 'index',
      route: '/',
      layout: 'default'
    },
    {
      name: 'about',
      route: '/about',
      layout: 'default'
    },
    {
      name: 'resourceItem',
      route: '/resources/([0-9]+)',
      layout: 'anotherLayout'
    },
    {
      name: 'error404',
      route: '.*',
      layout: 'default'
    }
  ],
  regions: [
    {
      name: 'navigation',
      domElement: 'header',
      isPersistent: true
    },
    {
      name: 'content',
      domElement: '#foo'
    },
    {
      name: 'anotherRegion',
      domElement: '#bar'
    },
    {
      name: 'footer',
      domElement: 'footer',
      isPersistent: true
    }
  ]
};

const validDefsUndefined = {
  ...validDefs.layouts,
  ...validDefs.regions,
  views: [
    {
      name: 'index',
      route: '/',
      layout: 'default'
    }
  ]
};

const definitionReaderInstance = createDefinitionReader(validDefs);
const definitionReaderInstanceUndefined = createDefinitionReader(validDefsUndefined);

test('Should return a definition reader object with the wanted properties', () => {
  expect(definitionReaderInstance).toHaveProperty('getLayoutNameByPath');
  expect(definitionReaderInstance).toHaveProperty('getPersistentRegionNames');
  expect(definitionReaderInstance).toHaveProperty('getLayoutDefinitionByName');
  expect(definitionReaderInstance).toHaveProperty('getRegionDefinitionByName');
  expect(definitionReaderInstance).toHaveProperty('layoutExists');
  expect(definitionReaderInstance).toHaveProperty('regionExists');
});

test('Should get the layout names by path', () => {
  expect(definitionReaderInstance.getLayoutNameByPath('/')).toBe('default');
  expect(definitionReaderInstance.getLayoutNameByPath('/about')).toBe('default');
  expect(definitionReaderInstance.getLayoutNameByPath('/resources/123')).toBe('anotherLayout');
  expect(definitionReaderInstance.getLayoutNameByPath('/xyz')).toBe('default');
  expect(definitionReaderInstanceUndefined.getLayoutNameByPath('/xyz')).toBeUndefined();
});

test('Should get the names of all regions defined as persistent', () => {
  expect(definitionReaderInstance.getPersistentRegionNames()).toStrictEqual(['navigation', 'footer']);
});

test('Should get the layout definitions by name', () => {
  expect(definitionReaderInstance.getLayoutDefinitionByName('default')).toStrictEqual(validDefs.layouts[0]);
  expect(definitionReaderInstance.getLayoutDefinitionByName('anotherLayout')).toStrictEqual(validDefs.layouts[1]);
});

test('Should get the region definitions by name', () => {
  expect(definitionReaderInstance.getRegionDefinitionByName('content')).toStrictEqual(validDefs.regions[1]);
  expect(definitionReaderInstance.getRegionDefinitionByName('footer')).toStrictEqual(validDefs.regions[3]);
});

test('Should check if a layout exists', () => {
  expect(definitionReaderInstance.layoutExists('default')).toBeTruthy();
  expect(definitionReaderInstance.layoutExists('anotherLayout')).toBeTruthy();
  expect(definitionReaderInstance.layoutExists('xyz')).toBeFalsy();
});

test('Should check if a region exists', () => {
  expect(definitionReaderInstance.regionExists('navigation')).toBeTruthy();
  expect(definitionReaderInstance.regionExists('anotherRegion')).toBeTruthy();
  expect(definitionReaderInstance.regionExists('xyz')).toBeFalsy();
});
