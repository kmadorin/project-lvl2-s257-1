import program from 'commander';
import genDiff from '..';

export default () => {
  program
    .version('0.2.0')
    .arguments('<firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .action((firstConfig, secondConfig) => console.log(genDiff(firstConfig, secondConfig)));

  program.parse(process.argv);
  return program;
};
