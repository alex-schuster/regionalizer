/**
 * Holds the definitions object.
 *
 * @type {Object}
 */
let definitions;

/**
 * Sets the definitions object used by regionalizer.
 *
 * @param {Object} passedDefinitions The definitions object.
 */
export const setDefinitions = (passedDefinitions) => {
  definitions = passedDefinitions;
};

/**
 * Returns the definitions of all defined layouts.
 *
 * @return {Array<Object>} An array containing all layout definition objects.
 */
export const getLayoutDefinitions = () => definitions.layouts;

/**
 * Returns the definitions of all defined views.
 *
 * @return {Array<Object>} An array containing all view definition objects.
 */
export const getViewDefinitions = () => definitions.views;

/**
 * Returns the definitions of all defined regions.
 *
 * @return {Array<Object>} An array containing all region definition objects.
 */
export const getRegionDefinitions = () => definitions.regions;

/**
 * Returns a definition object of a given overall definition object key and a name.
 *
 * @param {string} key The key inside the overall definition object.
 * @param {string} itemName The name property of the searched item.
 */
const getDefinition = (key, itemName) => definitions[key].filter(
  (item) => item.name === itemName
)[0];

/**
 * Returns the layout definition object by a given layout name.
 *
 * @param {string} layoutName The name of the layout.
 * @return {Object} The layout definition object.
 */
export const getLayoutDefinitionByName = (layoutName) => getDefinition('layouts', layoutName);

/**
 * Returns the region definition object by a given region name.
 *
 * @param {string} regionName The name of the region.
 * @return {Object} The region definition object.
 */
export const getRegionDefinitionByName = (regionName) => getDefinition('regions', regionName);

/**
 * Checks if a layout exists by name.
 *
 * @param {string} layoutName The name of the layout in question.
 * @return {boolean} True if it exists.
 */
export const layoutExists = (layoutName) => !!getLayoutDefinitionByName(layoutName);

/**
 * Checks if a region exists by name.
 *
 * @param {string} regionName The name of the region in question.
 * @return {boolean} True if it exists.
 */
export const regionExists = (regionName) => !!getRegionDefinitionByName(regionName);

/**
 * Returns the view's name by path.
 *
 * @param {string} path The path for which the view's name is requested.
 * @return {string} The view's name.
 */
export const getViewNameByPath = (path) => {
  const viewDef = definitions.views.filter((item) => !!path.match(`^${item.route}$`))[0];
  return viewDef.name;
};

/**
 * Returns the DOM element that wraps a region.
 *
 * @param {string} regionName The name of the region.
 * @return {Element} The region DOM element.
 */
export const getRegionDomElement = (regionName) => {
  const regionDef = definitions.regions.filter((item) => item.name === regionName)[0];
  const regionIdentifier = regionDef.domElement;
  return document.querySelector(regionIdentifier);
};

/**
 * Returns an array containing the names of all regions defined as persistent.
 *
 * @return {Array} The array of all persistent region's names.
 */
export const getPersistentRegionNames = () => {
  const persistentRegionDefs = definitions.regions.filter((item) => !!item.isPersistent);
  return persistentRegionDefs.map((item) => item.name);
};
