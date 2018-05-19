#!/usr/bin/env node
import program from 'commander';
import genDiff from '..';

const gendiff = () => {
  program
    .version('0.7.1')
    .arguments('<firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .action((config1, config2) => console.log(genDiff(config1, config2, program.format)));

  program.parse(process.argv);
  return program;
};

gendiff();
