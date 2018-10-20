const debug = require('debug')('keendoo:cli:migrate');
const fs = require('fs-extra');
const path = require('path');
const pathResolver = require('./synchronize_lib/path_resolver');
const isArray = require('isarray');
const containsChild = require('./synchronize_lib/path_child_finder').containsChild;
const chalk = require('chalk');
const padr = require('pad-right');
const truncate = pathResolver.truncate;

class Converter {

  constructor(dest = '', src = '', pattern = Converter.GLOB) {
    this.dest = Converter.normalizePath(dest);
    this.src = Converter.normalizePath(src);
    this.pattern = pattern;
    this.converters = {};
  }

  static normalizePath(opt) {
    if (isArray(opt)) {
      return _.map(opt, (o) => {
        return path.normalize(o);
      });
    } else {
      return path.normalize(opt);
    }
  }

  static get GLOB() {
    return '*.+(xml)';
  }

  static coerce(opt) {
    let _opt = !isArray(opt) ? [opt] : opt;

    if (containsChild(_opt)) {
      throw new Error('The directories contain a child of one of the parent directories.');
    }

    _opt = _opt.map((o) => {
      fs.ensureDirSync(o);
      return path.resolve(o);
    });

    return _opt.length === 1 ? _opt[0] : _opt;
  }

  static log(verb, color, text) {
    console.log(`${chalk[color](padr(verb.toUpperCase(), 7, ' '))}: ${text}`);
  }

  startConverter() {
    console.log(`Start analyzing TABS from "${chalk.blue(truncate(this.src))}"`);
    
    // this.converters.main = chokidar.watch(this.src, {
    //   awaitWriteFinish: true
    // });

    // this.watchers.main.on('all', function (event, filePath) { //function needed to access arguments.
    //   debug('%O', arguments);
    //   if (!this.handledFile(event, filePath)) {
    //     debug(`Unhandled event "${event}" or file "${filePath}"`);
    //     return;
    //   }
    //   this.triggerAction(event, filePath);
    // }.bind(this));
    console.log('Migration complete :-)');
  }

  run() {
    setTimeout(() => {
      // Delayed to 5ms, to free the thread to print the logo before any other log
      console.log(`Start migrating from "${chalk.blue(truncate(this.src))}", to "${chalk.blue(truncate(this.dest))}"`);
      this.startConverter();
    }, 5);
  }
}

module.exports = {
  command: 'migrate',
  desc: 'Studio JSF to WebUI migration tool',
  handler: function (argv) {
    //require('../lib/analytics').event('keendoo:synchronize', argv._.slice(1).join(' '));
    debug('Argv: %O', argv);
    
    const c = new Converter(argv.dest, argv.src, argv.pattern);
    debug('%O', c);
    return c.run.apply(c);
  },
  builder: (yargs) => {
    return yargs
      .help()
      .options({
        src: pathResolver.src(),
        dest: pathResolver.dest(),
        pattern: {
          describe: 'Glob matching pattern for synchronizable files',
          default: Converter.GLOB
        }
      }).coerce(['src', 'dest'], Converter.coerce);
  },
  Converter: Converter,
  Triggers: {
    //Copy: CopyTrigger,
    //Unlink: UnlinkTrigger,
    //Mkdirp: MkdirTrigger
  }
};
