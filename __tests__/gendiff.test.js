import fs from 'fs';
import genDiff from '../src';

test('difference beetwen two JSON files', () => {
  const configPath1 = fs.realpathSync('__tests__/__fixtures__/before.json');
  const configPath2 = fs.realpathSync('__tests__/__fixtures__/after.json');
  const diff = fs.readFileSync('__tests__/__fixtures__/difference', 'utf-8');
  const diffReverse = fs.readFileSync('__tests__/__fixtures__/differenceReverse', 'utf-8');
  expect(genDiff(configPath1, configPath2)).toBe(diff);
  expect(genDiff(configPath2, configPath1)).toBe(diffReverse);
});

test('difference beetwen two YML files', () => {
  const configPath1 = fs.realpathSync('__tests__/__fixtures__/before.yml');
  const configPath2 = fs.realpathSync('__tests__/__fixtures__/after.yml');
  const diff = fs.readFileSync('__tests__/__fixtures__/difference', 'utf-8');
  const diffReverse = fs.readFileSync('__tests__/__fixtures__/differenceReverse', 'utf-8');
  expect(genDiff(configPath1, configPath2)).toBe(diff);
  expect(genDiff(configPath2, configPath1)).toBe(diffReverse);
});
