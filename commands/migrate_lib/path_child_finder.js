const isArray = require('isarray');
const _ = require('lodash');
const debug = require('debug')('keendoo:cli:sync:lib:finder');
const path = require('path');

class ChildFinder {
  constructor(array) {
    const _array = isArray(array) ? array : [array];
    this.array = _.map(_array, (o) => {
      return path.resolve(o) + path.sep;
    });
  }

  findChild() {
    return _.find(this.array, (e, i) => {
      const others = _.slice(this.array, 0);
      others.splice(i, 1);

      debug('%O - Elt: %O - %O - Others: %O.', this.array, e, i, others);
      console.assert(this.array.length === 1 || others.length === this.array.length - 1);
      return _.find(others, (o) => {
        return o.startsWith(`${e}`);
      });
    });
  }
}

module.exports = ChildFinder;

module.exports.containsChild = (array) => {
  const cf = new ChildFinder(array);
  return !!cf.findChild();
};
