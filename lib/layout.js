import {
  layoutExists,
  getLayoutDefinitionByName,
  getViewDefinitions,
  getViewNameByPath
} from './definitionReader';
import Region from './region';
import { renderLayout } from './renderer';

/**
 * Creates and returns a Layout object.
 *
 * @param {string} layoutName The layout's name property.
 * @return {Layout} The created Layout object.
 */
const Layout = (layoutName) => {
  if (layoutExists(layoutName)) {
    const layoutDef = getLayoutDefinitionByName(layoutName);
    return {
      name: layoutName,
      regions: layoutDef.regions.map((regionName) => new Region(regionName)),
      domElement: document.querySelector('body'),
      getRendering(providedData) {
        const renderedData = {};
        const renderings = this.regions.map((region) => region.getRendering());
        // Create markup in a suitable form (data objects) for each region.
        this.regions.forEach((item, index) => {
          renderedData[item.name] = renderings[index].placeholder;
        });
        return {
          layoutMarkup: renderLayout(this.name, { ...providedData, ...renderedData }),
          regionElements: renderings
        };
      }
    };
  }
  throw new Error('A layout with this name does not exist.');
};

/**
 * Creates and returns a Layout object according to a defined view.
 *
 * @param {string} viewName The name of the view.
 * @return {Layout} The new Layout object.
 */
export const createLayoutByViewName = (viewName) => {
  const views = getViewDefinitions();
  const viewDef = views.filter((item) => item.name === viewName)[0];
  const layoutName = viewDef.layout;
  return new Layout(layoutName);
};

/**
 * Creates a Layout object by path and returns it.
 *
 * @param {string} path The path, as provided to showView().
 * @return {Layout} The created Layout object.
 */
export const createLayoutByPath = (path) => {
  const viewName = getViewNameByPath(path);
  return createLayoutByViewName(viewName);
};

export default Layout;
