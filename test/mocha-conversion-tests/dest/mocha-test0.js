/*
 <suman-message>
 Please read all of this at least once :)
 This file has been converted from a Mocha test to a Suman test using the "$ suman --convert" command.
 To get rid of this comment block, you can run can re-run "$ suman --convert" with the "--omit-comments" option.
 For the default conversion, we have used the standard ES5 Common.js require syntax; if you wish to use ES6 import syntax, you can
 run the original command with with the --es6 flag, like so: $ suman --convert --es6

 You may see that the core module assert is an argument to the top-level describe callback.
 Suman allows you to reference any core module in the top-level describe callback, which saves you some ink
 by avoiding the need to have several require/import statements for each core module at the top of your file.
 Furthermore, you can reference any dependency listed in your suman.ioc.js file, as you would a core module
 in the top-level describe callback. This is a quite useful feature compared to simply loading core modules,
 because you can load asynchronous dependencies via this method.

 Because Mocha has bugs, converting from Mocha is not 100% straightforward, here are a couple bugs to look out for:
 https://github.com/mochajs/mocha/issues/2165#event-599798863

 What this means is that using Mocha you should *not* reference this.currentTest in a before/after hook, only beforeEach/afterEach/it
 </suman-message>
 */

const Test = require('suman').init(module);

/**
 * Created by denmanm1 on 3/20/16.
 */

var assert = require("assert"),
    fs = require('fs');


Test.describe('a', function () {


    this.after.cb(t => {
        var d = t.done;
        console.log('before this a:', this.parent);
        d();

    });

    this.beforeEach(t => {

        console.log('beforeEach this a:', this.parent);

    });


    this.it.cb('a', t => {
        
        t.handleAssertions(function () {
            assert(false);
        });

        console.log('it this a:', this.parent);

        t.done();

    });


    this.describe('b', function () {

        this.before(t => {

            console.log('before this b:', this.parent);

        });

        this.beforeEach(t => {

            console.log('beforeEach this b:', this.parent);
            (this.parent.title);

        });


        this.it.cb('b', t => {
            var done = t.done;
            console.log('it this b:', this.parent);
            done();
        });


    });


});
