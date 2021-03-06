'use striiiict';

//core
const assert = require('assert');
const util = require('util');
const cp = require('child_process');

//npm
const inquirer = require('suman-inquirer');
const colors = require('colors/safe');

//project
const debug = require('debug')('suman:interactive');
const chooseDirs = require('../../helpers/choose-dirs');
const sumanUtils = require('suman-utils/utils');
const rejectionHandler = require('../../interactive-rejection-handler');
const localOrGlobal = require('../../helpers/local-or-global-suman');
const choices = require('../../helpers/choices');
const getOptions = require('../../helpers/available-options');
const filteredOptions = require('../../helpers/return-filtered-opts');
const watchHelper = require('../../helpers/watch-helper');
const iu = require('../../helpers/interactive-utils');
const startGenerateCommand = require('../../helpers/start-generate-command');
const promiseReducer = require('../../helpers/promise-reducer');

/////////////////////////////////////////////////////////////

const opts = [
  'verbose',
  'sparse',
  'match-any',
  'match-none',
  'match-all'
];

const availableOpts = filteredOptions(opts);

////////////////////////////////////////////////////////////

const fnsComplete = [];

const fns = [
  startGenerateCommand,
  watchHelper,
  chooseDirs,
  getOptions,
  localOrGlobal
];

function run (opts, cb) {

  promiseReducer(run, opts, cb, fns, fnsComplete).then(function (obj) {

    const sumanExec = iu.mapSumanExec('suman', obj.localOrGlobal);
    const mustInstallSumanServer = obj.mustInstallSumanServer;
    const watchProperty = obj.watchProperty;
    const selectedOpts = obj[ 'command-line-options' ];
    const pathsToRun = obj.pathsToRun;

    if (mustInstallSumanServer) {
      console.log(' Note that because suman-server package is not installed, we have to run' +
        ' $ suman --use-server (just once), before using any watch features.');
    }

    const s = mustInstallSumanServer ? (sumanExec + ' --use-server &&') : '';
    const _cb = iu.createCallback(run, obj, cb);
    iu.allDoneHere([ '$', s, sumanExec, '--transpile', '--no-run', '--watch', watchProperty,
      pathsToRun, selectedOpts ], false, _cb);

  }).catch(rejectionHandler);

}

module.exports = function makePromise (opts, cb) {

  opts.onlyOneFile = false;
  opts.optionsToUse = availableOpts;
  opts.msg = colors.yellow(' => To run multiple tests you will use the Suman runner which will ' +
      'run each test in a separate process.') +
    '\n Suman will automatically use the runner when you point Suman at multiple files, or a directory.\n\n'
    + colors.blue(' First we will give you the chance to select one or more files or directories to' +
      'run the runner against.\n' +
      ' If you select only one file, then you must use the --runner option to tell Suman to use the runner, ' +
      'instead of just a single process.') + '\n\n\n' +
    ' This utility will make sure you do it right, don\'t worry.' + '\n\n' +
    colors.green(' Please confirm.') + ' (To skip this message, use the --fast option).';

  return run(opts,cb).catch(rejectionHandler);

};