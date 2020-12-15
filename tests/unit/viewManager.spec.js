/* eslint-disable no-undef */
import createViewManager from '../../lib/viewManager';
import createDefinitionReader from '../../lib/definitionReader';

jest.mock('../../lib/render', () => ({
  renderHead: () => '<meta charset="utf-8"/>'
}));

jest.mock('../../lib/definitionReader', () => ({
  __esModule: true,
  default: () => ({
    getLayoutNameByPath: jest.fn()
  })
}));

const mockDefinitionReader = createDefinitionReader();

const mockPersistentRegionElement = document.createElement('div');
mockPersistentRegionElement.setAttribute('id', 'region1');

const createNonPersistentRegionElement = () => {
  const mockRegion2Element = document.createElement('div');
  mockRegion2Element.setAttribute('id', 'region2');
  return mockRegion2Element;
};

jest.mock('../../lib/view', () => ({
  __esModule: true,
  default: () => ({
    render: () => ({
      layout:
        `
        <template data-region-name="region1"></template>
        <template data-region-name="region2"></template>
        `,
      regions: [
        {
          name: 'region1',
          query: '#region1',
          element: mockPersistentRegionElement,
          isPersistent: true
        },
        {
          name: 'region2',
          query: '#region2',
          element: createNonPersistentRegionElement(),
          isPersistent: false
        }
      ]
    })
  })
}));

test('Should return a view manager object with the wanted properties', () => {
  const viewManager = createViewManager(mockDefinitionReader);
  expect(viewManager).toHaveProperty('insertView');
});

test('Should update the view', () => {
  const viewManager = createViewManager(mockDefinitionReader);
  document.body.innerHTML = '<div id="region0"></div>';
  viewManager.insertView('/', { foo: 'foo' }, { bar: 123 }, 'en', 'ltr');
  expect(document.querySelector('#region0')).toBeFalsy();
  expect(document.querySelector('#region1')).toBeTruthy();
  expect(document.querySelector('#region2')).toBeTruthy();
});

test('Should only remember changes made to a persistent region', () => {
  const viewManager = createViewManager(mockDefinitionReader);
  document.body.innerHTML = '<div id="region1"></div><div id="region2"></div>';
  viewManager.insertView('/foo');
  document.querySelector('#region1').innerHTML = '<span id="foo"></span>';
  document.querySelector('#region2').innerHTML = '<span id="bar"></span>';
  viewManager.insertView('/bar');
  const region1 = document.querySelector('#region1');
  const region2 = document.querySelector('#region2');
  expect(region1.querySelector('#foo')).toBeTruthy();
  expect(region2.querySelector('#bar')).toBeFalsy();
});

test('Should remove the attributes "lang" and "dir" from the "html" DOM element', () => {
  const viewManager = createViewManager(mockDefinitionReader);
  const html = document.getElementsByTagName('html')[0];
  html.setAttribute('lang', 'en');
  html.setAttribute('dir', 'ltr');
  viewManager.insertView('/');
  expect(html.getAttribute('lang')).toBe(null);
  expect(html.getAttribute('dir')).toBe(null);
});
