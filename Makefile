
test:
	@node_modules/.bin/tape test*

example:
	@node_modules/.bin/babel-node example.js

.PHONY: test

