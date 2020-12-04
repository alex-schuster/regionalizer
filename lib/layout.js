import {
  layoutExists,
  getLayoutDefinitionByName,
  getViewDefinitions,
  getViewNameByPath
} from './definitionReader';
import region from './region';
import { renderLayout } from './renderer';

/**
 * Creates and returns a layout object.
 *
 * @param {string} layoutName The layout's name property.
 * @return {layout} The created layout object.
 */
const layout = (layoutName) => {
  if (layoutExists(layoutName)) {
    const layoutDef = getLayoutDefinitionByName(layoutName);
    return {
      name: layoutName,
      regions: layoutDef.regions.map((regionName) => region(regionName)),
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
 * Creates and returns a layout object according to a defined view.
 *
 * @param {string} viewName The name of the view.
 * @return {layout} The new layout object.
 */
export const createLayoutByViewName = (viewName) => {
  const views = getViewDefinitions();
  const viewDef = views.filter((item) => item.name === viewName)[0];
  const layoutName = viewDef.layout;
  return layout(layoutName);
};

/**
 * Creates a layout object by path and returns it.
 *
 * @param {string} path The path, as provided to showView().
 * @return {Object} The created layout object.
 */
export const createLayoutByPath = (path) => {
  const viewName = getViewNameByPath(path);
  return createLayoutByViewName(viewName);
};

export default layout;
