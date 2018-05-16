import fs from 'fs';
import genDiff from '../src';

test('difference beetwen two JSON files', () => {
  const firstConfigPath = fs.realpathSync('__tests__/__fixtures__/before.json');
  const secondConfigPath = fs.realpathSync('__tests__/__fixtures__/after.json');
  const diff = fs.readFileSync('__tests__/__fixtures__/difference', 'utf-8');
  const diffReverse = fs.readFileSync('__tests__/__fixtures__/differenceReverse', 'utf-8');
  expect(genDiff(firstConfigPath, secondConfigPath)).toBe(diff);
  expect(genDiff(secondConfigPath, firstConfigPath)).toBe(diffReverse);
});

