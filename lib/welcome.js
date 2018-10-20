const chalk = require('chalk');
const pad = require('pad-left');

module.exports = (text, lightColor = '206c7f', darkColor = '206c7f') => {
  const d = chalk.hex(darkColor);
  const l = chalk.hex(lightColor);
  text = `${d('∞ Keendoo')} ${text}`;

  return '\n' + //
    l(' _  _  ____  ____  _  _  ____   _____  _____ ') + '\n' +
  l('( )/ )( ___)( ___)( \\( )(  _ \\ (  _  )(  _  )') + '\n' +
    l(' )  (  )__) )__)  )  (  ) (_) ) )(_)(  )(_)( ') + '\n' +
    l('(_)\\_)(____)(____)(_)\\_)(____/ (_____)(_____)') + '\n' +
    '\n' +
    pad('Welcome to', 25, ' ') + '\n' +
    pad(text, 50, ' ') + '\n' +
    '\n';

};
