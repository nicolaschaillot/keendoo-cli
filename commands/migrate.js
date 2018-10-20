const debug = require('debug')('keendoo:cli:migrate');
const fs = require('fs-extra');
const path = require('path');
const pathResolver = require('./synchronize_lib/path_resolver');
const isArray = require('isarray');
const containsChild = require('./synchronize_lib/path_child_finder').containsChild;
const chalk = require('chalk');
const padr = require('pad-right');
const truncate = pathResolver.truncate;
const dir = require('node-dir');

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
    console.log(this.tabPattern);
    // Parse TAB xml files
    dir.readFiles(`${this.src}/.metadata`,
      {
        match: /.tab.xml$/,
        exclude: /^\./
      }, function (err, content, filename, next) {
        if (err) {
          throw err;
        }
        console.log(`Processing TAB : ${filename} ...`);
        this.triggerAction('parseTab', filename);
        next();
      }.bind(this),
      function (err) {
        if (err) {
          throw err;
        }
        //console.log('finished reading files:', files);
      }
    );

    //console.log('Migration complete :-)');
  }

  resolveAction(event, fileName) {
    // unlink, unlinkDir
    if (event.startsWith('parseTab')) {
      return new ParseTabTrigger(fileName);
    // } else
    // if (['change', 'add'].indexOf(event) >= 0) {
    //   return new CopyTrigger(filePath, this.computeDestination(filePath));
    // } else
    // if (event === 'addDir') {
    //   return new MkdirTrigger(this.computeDestination(filePath));
    } else {
      debug(`Unhandled event: ${event}`);
    }

    return undefined;
  }

  triggerAction(event, fileName) {
    const a = this.resolveAction(event, fileName);
    if (a) {
      a.trigger();
    }
  }

  run() {
    setTimeout(() => {
      // Delayed to 5ms, to free the thread to print the logo before any other log
      console.log(`Start migrating from "${chalk.blue(truncate(this.src))}", to "${chalk.blue(truncate(this.dest))}"`);
      this.startConverter();
    }, 5);
  }
}
class ActionTrigger {
  trigger() {
    debug('Not overrided method!');
  }

  debug() {
    debug('New action registered: %O', this);
  }

  get displaySrc() {
    return truncate(this.source);
  }

  get displayDest() {
    return truncate(this.destination);
  }
}
class ParseTabTrigger extends ActionTrigger {
  constructor(fileName) {
    super();
    this.fileName = fileName;
    this.debug();
  }

  trigger() {
    console.log(this.fileName);
    //fs.removeSync(this.destination);
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
    ParseTab: ParseTabTrigger,
  }
};