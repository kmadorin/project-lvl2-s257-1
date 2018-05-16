install:
	npm install

run:
	npm run babel-node -- 'src/bin/gendiff.js'

build:
	rm -rf dist
	npm run build

test:
	npm run test

lint:
	npm run eslint .

publish:
	npm publish

push:
	make lint && make test && git push
