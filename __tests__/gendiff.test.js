import fs from 'fs';
import genDiff from '../src';

test('difference beetwen two JSON files', () => {
  const configPath1 = fs.realpathSync('__tests__/__fixtures__/before.JSON');
  const configPath2 = fs.realpathSync('__tests__/__fixtures__/after.json');
  const diff = fs.readFileSync('__tests__/__fixtures__/diff', 'utf-8');
  const diffReverse = fs.readFileSync('__tests__/__fixtures__/diffReverse', 'utf-8');
  expect(genDiff(configPath1, configPath2)).toBe(diff);
  expect(genDiff(configPath2, configPath1)).toBe(diffReverse);
});

test('difference beetwen two YML files', () => {
  const configPath1 = fs.realpathSync('__tests__/__fixtures__/before.JSON');
  const configPath2 = fs.realpathSync('__tests__/__fixtures__/after.yaml');
  const diff = fs.readFileSync('__tests__/__fixtures__/diff', 'utf-8');
  const diffReverse = fs.readFileSync('__tests__/__fixtures__/diffReverse', 'utf-8');
  expect(genDiff(configPath1, configPath2)).toBe(diff);
  expect(genDiff(configPath2, configPath1)).toBe(diffReverse);
});

test('difference beetwen two INI files', () => {
  const configPath1 = fs.realpathSync('__tests__/__fixtures__/before.INI');
  const configPath2 = fs.realpathSync('__tests__/__fixtures__/after.ini');
  const diff = fs.readFileSync('__tests__/__fixtures__/diff', 'utf-8');
  const diffReverse = fs.readFileSync('__tests__/__fixtures__/diffIniReverse', 'utf-8');
  expect(genDiff(configPath1, configPath2)).toBe(diff);
  expect(genDiff(configPath2, configPath1)).toBe(diffReverse);
});

test('difference beetwen two other files', () => {
  const configPath1 = fs.realpathSync('__tests__/__fixtures__/before.abc');
  const configPath2 = fs.realpathSync('__tests__/__fixtures__/after.ini');
  const errorMessage = 'unkown format: .abc';

  function badFirstFileFormat() {
    genDiff(configPath1, configPath2);
  }
  expect(badFirstFileFormat).toThrowError(errorMessage);

  function badSecondFileFormat() {
    genDiff(configPath2, configPath1);
  }
  expect(badSecondFileFormat).toThrowError(errorMessage);
});
