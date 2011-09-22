test('Test R.registerLocale', function () {
   
    R.registerLocale('en-GB', {
        
        sampleString: 'A sample string',
        withInteger: 'A sample string with %i integers',
        withManyIntegers: '%i sample strings with %i integers',
        withString: 'A sample %s',
        withManyStrings: 'A sample %s with many %s',
        withNamed: 'A sample %(string)',
        withManyNamed: 'A sample %(string) with many %(strings) %(x)',
        withManyNamedDuplicates: 'A sample %(string) with many %(string) %(x)',
        withIntStringMixed: '%i sample %s with %i %s',
        withIntStringObjMixed: '%i sample %(string) with %i %(string) %s',
        'oddly.named.id': 'String',
        'even-odder\named_id': 'String'
        
    });
    
    R.registerLocale('en-US', {
        
        sampleString: 'US: A sample string',
        withInteger: 'US: A sample string with %i integers',
        withManyIntegers: 'US: %i sample strings with %i integers',
        withString: 'US: A sample %s',
        withManyStrings: 'US: A sample %s with many %s',
        withNamed: 'US: A sample %(string)',
        withManyNamed: 'US: A sample %(string) with many %(strings) %(x)',
        withManyNamedDuplicates: 'US: A sample %(string) with many %(string) %(x)',
        withIntStringMixed: 'US: %i sample %s with %i %s',
        withIntStringObjMixed: 'US: %i sample %(string) with %i %(string) %s',
        'oddly.named.id': 'String',
        'even-odder\named_id': 'String'
        
    });
    
});

test('Test R.setLocale', function () {
    R.setLocale('en-US');
    equal(R.lang, 'en-US');
    
    R.setLocale('en-GB');
    equal(R.lang, 'en-GB');
});

module('R', {
    
    setup: function () {
        R.registerLocale('en-GB', {
            
            sampleString: 'A sample string',
            withInteger: 'A sample string with %i integers',
            withManyIntegers: '%i sample strings with %i integers',
            withString: 'A sample %s',
            withManyStrings: 'A sample %s with many %s',
            withNamed: 'A sample %(string)',
            withManyNamed: 'A sample %(string) with many %(strings) %(x)',
            withManyNamedDuplicates: 'A sample %(string) with many %(string) %(x)',
            withIntStringMixed: '%i sample %s with %i %s',
            withIntStringObjMixed: '%i sample %(string) with %i %(string) %s',
            'oddly.named.id': 'String',
            'even-odder\named_id': 'String'
            
        });
        
        R.setLocale('en-GB');
    }
    
});

test('returning strings with no args', function () { 
    equal(R('sampleString'), 'A sample string');
});


test('returning strings with 1 integer', function () {
    equal(R('withInteger'), 'A sample string with %i integers');
    equal(R('withInteger', 1), 'A sample string with 1 integers');
    equal(R('withInteger', [2]), 'A sample string with 2 integers');
    equal(R('withInteger', { i: 3 }), 'A sample string with 3 integers');
    equal(R('withInteger', { i: [3] }), 'A sample string with 3 integers');
});

test('returning strings with no many integers', function () { 
    equal(R('withManyIntegers'), '%i sample strings with %i integers');
    equal(R('withManyIntegers', 15), '15 sample strings with 15 integers');
    equal(R('withManyIntegers', 2, 1), '2 sample strings with 1 integers');
    equal(R('withManyIntegers', [4, 10]), '4 sample strings with 10 integers');
    equal(R('withManyIntegers', { i: [4, 10] }), '4 sample strings with 10 integers');
    equal(R('withManyIntegers', { i: 2 }), '2 sample strings with 2 integers');
});
   
test('returning strings with 1 string', function () {  
    equal(R('withString'), 'A sample %s');
    equal(R('withString', 'string'), 'A sample string');
    equal(R('withString', ['document']), 'A sample document');
    equal(R('withString', { s: 'document' }), 'A sample document');
    equal(R('withString', { s: ['string'] }), 'A sample string');
});

test('returning strings with many strings', function () {  
    equal(R('withManyStrings'), 'A sample %s with many %s');
    equal(R('withManyStrings', 'bar'), 'A sample bar with many bar');
    equal(R('withManyStrings', 'string', 'strings'), 'A sample string with many strings');
    equal(R('withManyStrings', ['string', 'strings']), 'A sample string with many strings');
    equal(R('withManyStrings', { s: ['biz', 'bang'] }), 'A sample biz with many bang');
});
   
test('returning strings with 1 named arg', function () {  
    equal(R('withNamed'), 'A sample %(string)');
    equal(R('withNamed', { string: 'biz' }), 'A sample biz');
    equal(R('withNamed', { string: 'foo' }), 'A sample foo');
});
   
test('returning strings with many named args', function () {  
    equal(R('withManyNamed'), 'A sample %(string) with many %(strings) %(x)');
    equal(R('withManyNamed', { string: 'bar' }), 'A sample bar with many %(strings) %(x)');
    equal(R('withManyNamed', { strings: 'biz', x: 'baz', string: 'foo' }), 'A sample foo with many biz baz');
    equal(R('withManyNamed', { strings: 'biz' }, { x: 'baz', string: 'foo' }), 'A sample foo with many biz baz');
});

test('returning strings with named args with duplicates', function () {     
    equal(R('withManyNamedDuplicates'), 'A sample %(string) with many %(string) %(x)');
    equal(R('withManyNamedDuplicates', { string: 'bar' }), 'A sample bar with many bar %(x)');
    equal(R('withManyNamedDuplicates', { string: 'foo', strings: 'biz', x: 'baz' }), 'A sample foo with many foo baz');
    equal(R('withManyNamedDuplicates', { string: 'foo' }, { strings: 'biz', x: 'baz' }), 'A sample foo with many foo baz');
});

test('returning strings with mixed strings and ints', function () {
    equal(R('withIntStringMixed'), '%i sample %s with %i %s');
    equal(R('withIntStringMixed', 1), '1 sample %s with 1 %s');
    equal(R('withIntStringMixed', 1, 2, 'string', 'strings'), '1 sample string with 2 strings');
    equal(R('withIntStringMixed', [1, 2], ['string', 'strings']), '1 sample string with 2 strings');
    equal(R('withIntStringMixed', [1, 'string'], [2, 'strings']), '1 sample string with 2 strings');
    equal(R('withIntStringMixed', { i: 1, s: ['string', 'strings'] }), '1 sample string with 1 strings');
    equal(R('withIntStringMixed', { i: [5, 6] }), '5 sample %s with 6 %s');
    equal(R('withIntStringMixed', { s: 'string' }), '%i sample string with %i string');
    equal(R('withIntStringMixed', 5, 10, 'foo', 'bar'), '5 sample foo with 10 bar');
    equal(R('withIntStringMixed', [5], 10, ['foo'], 'bar'), '5 sample foo with 10 bar');
    equal(R('withIntStringMixed', { i: [5, 10], s: ['foo', 'bar'] }), '5 sample foo with 10 bar');
    equal(R('withIntStringMixed', { i: 5 }, { i: 10 }, { s: 'foo' }, 'bar'), '5 sample foo with 10 bar');
});
    
test('returning strings with mixed strings, ints and objects', function () {  
    equal(R('withIntStringObjMixed'), '%i sample %(string) with %i %(string) %s');
    equal(R('withIntStringObjMixed', 1), '1 sample %(string) with 1 %(string) %s');
    equal(R('withIntStringObjMixed', 'string'), '%i sample %(string) with %i %(string) string');
    equal(R('withIntStringObjMixed', 'string', 1), '1 sample %(string) with 1 %(string) string');
    equal(R('withIntStringObjMixed', { string: 'test' }), '%i sample test with %i test %s');
    equal(R('withIntStringObjMixed', { string: 'test' }, 1, 'string'), '1 sample test with 1 test string');
    equal(R('withIntStringObjMixed', [1], ['string'], { string: 'test' }), '1 sample test with 1 test string');
    equal(R('withIntStringObjMixed', { i: [1], s: 'bar', string: 'biz' }), '1 sample biz with 1 biz bar');
    equal(R('withIntStringObjMixed', { string: 'test' }, { i: [1] }, { s: 'bar' }), '1 sample test with 1 test bar');
});

test('locale negotiation', function () {
    R.localeOrder('en-GB', 'en-US', 'zu');
    
    R.setLocale('zu');
    equal(R.lang, 'zu', 'Local is zu');
    
    R.setLocale('en-US');
    equal(R.lang, 'en-US', 'Local is en-US');
    
    R.setLocale('da');
    equal(R.lang, 'en-GB', 'Local is en-GB (first preferred language in locale order)');
    
    R.setLocale('da', true);
    equal(R.lang, 'da', 'Local is da (forced)'); 
});