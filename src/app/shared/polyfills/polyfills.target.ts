/***************************************************************************************************
 * BROWSER POLYFILLS
    * /

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/set';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
import 'classlist.js';  // Run `yarn add classlist.js`.

/** IE10, IE11 and all Firefox browsers require the following to support `@angular/animation`. **/
/** ALREADY IMPORTED WITH POLYMER COMPONENTS */
// import 'web-animations-js';  // Run `yarn add web-animations-js`.


/***************************************************************************************************
 * APPLICATION IMPORTS
 */

/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
import 'intl';  // Run `yarn add intl`.
/**
 * Need to import at least one locale-data with intl.
 */
import 'intl/locale-data/jsonp/en';
