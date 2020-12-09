import * as nunjucks from 'nunjucks';

/**
 * Renders the head.html template.
 *
 * @param {Object} data The data used to render the template.
 * @return {string} The rendered markup.
 */
export const renderHead = (data) => nunjucks.render('head.html', data);

/**
 * Renders a layout template.
 *
 * @param {string} layoutName The name of the layout file.
 * @param {Object} data The data used to render the template.
 * @return {string} The rendered markup.
 */
export const renderLayout = (layoutName, data) => nunjucks.render(`layouts/${layoutName}.html`, data);

/**
 * Renders a region template.
 *
 * @param {string} regionName The name of the region file.
 * @param {Object} data The data used to render the template.
 * @return {string} The rendered markup.
 */
export const renderRegion = (regionName, data) => nunjucks.render(`regions/${regionName}.html`, data);
