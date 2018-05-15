import program from 'commander';

const pkgVersion = process.env.npm_package_version;

export default () => {
  program
    .version(`${pkgVersion}`)
    .arguments('<firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .parse(process.argv);

  return program;
};
