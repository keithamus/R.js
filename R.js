/*jslint white: true, browser: true, devel: true, onevar: true, undef: true,
 nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true,
 newcap: true, immed: true, maxlen: 80, indent: 4 */
/*globals window: false*/
/*
 * R.js - Internationalisation Library
 *
 * R.js is a simple Javascript Internationalisation library
 *
 * This code is licensed under the MIT
 * For more details, see http://www.opensource.org/licenses/mit-license.php
 * For more information, see http://github.com/keithcirkel/R.js
 *
 * @author Keith Cirkel ('keithamus') <rdotjs@keithcirkel.co.uk>
 * @license http://www.opensource.org/licenses/mit-license.php
 * @copyright Copyright © 2011, Keith Cirkel
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
(function () {

    // this binds to `window` on browser, `global` on server
    var root = this,

    R = function (id, variables) {
        // If we haven't initialised our variables etc, then do so.
        if (!root.R.lang) {
            root.R.init();
        }
        // In the case we've been given comma separated arguments, we should
        // load them into an array and send them to render
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        if (args.length > 1) {
            return root.R.render(id, args);

        // Otherwise just send the `variables` var.
        } else {
            return root.R.render(id, [variables]);
        }
    };

    R.init = function (string_id) {
        //Initialise some variables.
        root.R.locales = {};
        root.R.lang = 'en-GB';
    };

    /*
     * Utility functions
     */

    R.realTypeOf = function (v) {
        if (typeof(v) === "object") {
            if (v === null) {
                return "null";
            } else if (v.constructor === ([]).constructor) {
                return "array";
            } else if (v.constructor === (new Date()).constructor) {
                return "date";
            } else if (v.constructor === (/^$/).constructor) {
                return "regex";
            } else {
                return "object";
            }
        }
        return typeof(v);
    };

    R.isPlural = function (obj) {
        // Does it have both 'one' and 'plural'?
        if (root.R.realTypeOf(obj) === 'object') {
            return obj.hasOwnProperty('one') && obj.hasOwnProperty('plural');
        }
        return false;
    };

    R.whichPlural = function (obj, args) {
        // If we have no integers, or the integer is lower than two, singular!
        if (args.i.length === 0 || args.i[0] < 2) {
            return obj.one;
        }
        // Otherwise, plural!
        return obj.plural;
    };

    /*
     * Core functions
     */

    // Use R.registerLocale to bind new langauges to R.
    R.registerLocale = function (locale, object) {
        //If we haven't initialised our variables etc, then do so.
        if (!root.R.lang) {
            root.R.init();
        }
        //Throw the object we've been given into locales.
        root.R.locales[locale] = object;
    };

    R.render = function (id, args) {
        var n, i, o, tmp = root.R.locales;

        // Make sure that the language object we're expecting is there
        if (!tmp[root.R.lang]) {
            throw new Error('Undefined language ' + root.R.lang);
        } else {
            tmp = tmp[root.R.lang];
        }

        // If turn ID into an array of split .s or just itself
        n = id.indexOf('.') > 0 ? id.toString().split('.') : [id];

        // Shuffle through `n` until we get to the object they're searching for
        while ((i = n.shift())) {
            if (tmp[i]) {
                tmp = tmp[i];
            } else {
                throw new Error('Undefined index ' + i);
            }
        }

        // If this is just a plain string, and we've no arguments, let's return
        if (typeof tmp === 'string' && (!args || args.length === 0)) {
            return tmp;
        }

        // Ok, we do have args, so lets parse them.
        args = root.R.parseVariables(args);

        // Check if we're dealing with a plural, and return appropriately.
        if (root.R.isPlural(tmp)) {
            return root.R.format(root.R.whichPlural(tmp, args), args);
        }

        return root.R.format(tmp, args);
    };

    R.parseVariables = function (args, ret) {
        var i, c, type = root.R.realTypeOf(args);

        // This is our structure for formatting, numbers go in i, string in s,
        // and the named arguments (i.e %(age)) go in named.
        if (!ret) {
            ret = { i: [], s: [], named: {} };
        }

        //Check args to see what type it is, and add to ret appropriately.
        if (type === 'number') {
            ret.i.push(args);
        } else if (type === 'string') {
            ret.s.push(args);
        } else if (type === 'date') {
            ret.i.push(args.toString());
        } else if (type === 'object') {
            for (i in args) {
                if (args.hasOwnProperty(i) && typeof args[i] !== 'object') {
                    ret.named[i] = args[i];
                }
            }
        } else if (type === 'array') {
            // Loop through the array, doing what we just did
            for (i = 0, c = args.length; i < c; ++i) {
                root.R.parseVariables(args[i], ret);
            }
        }

        return ret;
    };

    R.format = function (s, a) {
        var i, n, t, l, types = {i: '%i', s: '%s'}, tmp = '';
        //First we'll add all integers to the pot, then the strings
        for (t in types) {
            if (types.hasOwnProperty(t)) {
                l = types[t].length;
                for (i in a[t]) {
                    if (a[t][i]) {
                        if ((n = s.indexOf(types[t])) > 0) {
                            s = s.substr(0, n) + a[t][i] + s.substr(n + l);
                        }
                    }
                }
            }
        }

        //Now to loop through the named arguments!
        for (i in a.named) {
            if (a.named.hasOwnProperty(i)) {
                t = new RegExp("%\\(" + i + "\\)", 'g');
                s = s.replace(t, a.named[i]);
            }
        }

        return s;
    };

    root.R = R;

}());