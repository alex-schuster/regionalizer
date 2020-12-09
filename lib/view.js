import createRegion from './region';
import { renderLayout } from './render';

/**
 * The factory function for view objects.
 *
 * @param {string} layoutName The name of the layout to be used.
 * @param {string} initializedPersistentRegions The initializedPersistentRegions array (injected).
 * @param {Object} definitionReader A definitionReader object.
 * @return {layout} The layout object.
 */
const createView = (layoutName, initializedPersistentRegions, definitionReader) => {
  // Make sure the definition for a layout with this name exists.
  if (definitionReader.layoutExists(layoutName)) {
    /**
     * The definition object of this Layout (which is part of the overall definitions).
     *
     * @type {Object}
     */
    const layoutDefinition = definitionReader.getLayoutDefinitionByName(layoutName);

    return {
      /**
       * The name of the layout, as in the definitions.
       *
       * @type {string}
       */
      layoutName,

      /**
       * An array of regions (Region objects) present in this layout.
       *
       * @type {Array<Object>}
       */
      regions: layoutDefinition.regions.map((regionName) => {
        // Check if it is a persistent region that has already been initialized.
        const initializedPersistentRegion = initializedPersistentRegions.find(
          (item) => item.name === regionName
        );
        if (initializedPersistentRegion) {
          return initializedPersistentRegion;
        }
        const region = createRegion(regionName, definitionReader);
        // If it is a new persistent region, add it to initializedPersistentRegions.
        const persistentRegionNames = definitionReader.getPersistentRegionNames();
        if (persistentRegionNames.indexOf(regionName) !== -1) {
          initializedPersistentRegions.push(region);
        }
        return region;
      }),

      /**
       * Returns a rendering object consisting of the layout markup and the rendered regions.
       *
       * @param {Object} providedData An object containing the data that is passed to the Regions.
       * @return {Object} The rendering object (layout markup and the rendered regions).
       */
      getRendering(providedData) {
        const renderedData = {};
        const renderedRegions = this.regions.map((regionItem) => regionItem.getRendering());
        // Create markup in a suitable form (data objects) for each region.
        this.regions.forEach((item, index) => {
          renderedData[item.name] = renderedRegions[index].placeholder;
        });
        return {
          layoutMarkup: renderLayout(this.layoutName, { ...providedData, ...renderedData }),
          regionElements: renderedRegions
        };
      }
    };
  }

  // If no layout with the provided name exists, throw an error.
  throw new Error('A layout definition with this name does not exist.');
};

export default createView;