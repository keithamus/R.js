R.js
=====

R.js is a simple i18n framework for Javascript, using CommonJS. R.js should work in both browsers, and on Node.js, providing internationalisation capabilities to both.

R.js is tiny, at less than 900 bytes minified and gzipped (<2kb minified). R.js has no dependencies, but can be used easily with any other libraries you wish. R.js binds itself to window.R, or global.R on the server side.

Soon, R.js will be able to convert from XLIFF format, into R.js files, which can be easily compacted with R.js to provide one single small file for all your i18n needs.

---

To use R.js, simply register a language file like so:

    R.registerLocale('en-GB', { string: 'I am a string'});
    
Now you can set the locale to en-GB (which will automatically be picked up by the browser by the way), and get on with translating:

    R.setLocale('en-GB');
    R('string');
        -> "I am a string"
        
Of course, R.js has an advanced string-replacement engine which lets you replace integers, strings and named arguments inside your i18n strings. Lets have a look:

    R.registerLocale('en-GB', { items: 'There are %i %s on the %(place)' })
    R.setLocale('en-GB');
    R('items', 4, 'books', { place: 'shelf' });
        -> "There are 4 books on the shelf";
    R('items', [99, 'bottles of beer'], { place: 'wall' });
        -> "There are 99 bottles of beer on the wall";
    R('items', { i: 8, s: 'rashers of bacon', place: 'narwhal' });
        -> "There are 8 rashers of bacon on the narwhal";

R.js also can be used as an advanced sprintf engine, as by default if it cannot find the locale string, it will return the string you supplied it, like so:

    R('This %s doesnt exist', 'string');
        -> "This string doesnt exist";