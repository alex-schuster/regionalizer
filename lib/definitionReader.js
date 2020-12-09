/**
 * The factory function for definitionReader objects.
 *
 * @param {Object} providedDefinitions The definitions to read from.
 * @return {Object} The definitionReader object.
 */
const createDefinitionReader = (providedDefinitions) => {
  /**
   * Holds the definitions object.
   *
   * @type {Object}
   */
  const definitions = providedDefinitions;

  /**
   * Returns a definition object of a given overall definition object key and a name.
   *
   * @param {string} key The key inside the overall definition object.
   * @param {string} itemName The name property of the searched item.
   */
  const getDefinition = (key, itemName) => definitions[key].filter(
    (item) => item.name === itemName
  )[0];

  return {
    /**
     * Returns the view's name by path.
     *
     * @param {string} path The path for which the view's name is requested.
     * @return {string} The view's name.
     */
    getViewNameByPath(path) {
      const view = definitions.views.find((item) => path.match(`^${item.route}$`));
      if (view === undefined || view.name === undefined) {
        return undefined;
      }
      return view.name;
    },

    /**
     * Returns the layout's name by path.
     *
     * @param {string} path The path for which the layout's name is requested.
     * @return {string} The layout's name.
     */
    getLayoutNameByPath(path) {
      const view = definitions.views.find((item) => path.match(`^${item.route}$`));
      if (view === undefined || view.layout === undefined) {
        return undefined;
      }
      return view.layout;
    },

    /**
     * Returns the DOM element that wraps a region.
     *
     * @param {string} regionName The name of the region.
     * @return {Element} The region DOM element.
     */
    getRegionDomElement(regionName) {
      const regionDef = definitions.regions.filter((item) => item.name === regionName)[0];
      const regionIdentifier = regionDef.domElement;
      return document.querySelector(regionIdentifier);
    },

    /**
     * Returns an array containing the names of all regions defined as persistent.
     *
     * @return {Array} The array of all persistent region's names.
     */
    getPersistentRegionNames() {
      const persistentRegionDefs = definitions.regions.filter((item) => !!item.isPersistent);
      return persistentRegionDefs.map((item) => item.name);
    },

    /**
     * Returns the definitions of all defined layouts.
     *
     * @return {Array<Object>} An array containing all layout definition objects.
     */
    getLayoutDefinitions() {
      return definitions.layouts;
    },

    /**
     * Returns the definitions of all defined views.
     *
     * @return {Array<Object>} An array containing all view definition objects.
     */
    getViewDefinitions() {
      return definitions.views;
    },

    /**
     * Returns the definitions of all defined regions.
     *
     * @return {Array<Object>} An array containing all region definition objects.
     */
    getRegionDefinitions() {
      return definitions.regions;
    },

    /**
     * Returns the layout definition object by a given layout name.
     *
     * @param {string} layoutName The name of the layout.
     * @return {Object} The layout definition object.
     */
    getLayoutDefinitionByName(layoutName) {
      return getDefinition('layouts', layoutName);
    },

    /**
     * Returns the region definition object by a given region name.
     *
     * @param {string} regionName The name of the region.
     * @return {Object} The region definition object.
     */
    getRegionDefinitionByName(regionName) {
      return getDefinition('regions', regionName);
    },

    /**
     * Checks if a layout exists by name.
     *
     * @param {string} layoutName The name of the layout in question.
     * @return {boolean} True if it exists.
     */
    layoutExists(layoutName) {
      return !!this.getLayoutDefinitionByName(layoutName);
    },

    /**
     * Checks if a region exists by name.
     *
     * @param {string} regionName The name of the region in question.
     * @return {boolean} True if it exists.
     */
    regionExists(regionName) {
      return !!this.getRegionDefinitionByName(regionName);
    }
  };
};

export default createDefinitionReader;
