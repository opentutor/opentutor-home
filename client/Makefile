CYPRESS_IMAGE?=cypress/base:12
CYPRESS_DOCKER_ENTRYPOINT?=/bin/bash
CYPRESS_DOCKER_CACHE=$(PWD)/.cypress-docker

.PHONY: clean
clean:
	rm -rf .cache public

.PHONY: cypress-docker
cypress-docker:
	mkdir -p $(CYPRESS_DOCKER_CACHE)/.npm
	mkdir -p $(CYPRESS_DOCKER_CACHE)/.gatsby.cache
	mkdir -p $(CYPRESS_DOCKER_CACHE)/.root.cache
	docker run \
		--rm \
		-it \
		--entrypoint $(CYPRESS_DOCKER_ENTRYPOINT) \
		-v $(PWD):/client \
		-v /client/node_modules \
		-v /client/public \
		--mount type=bind,source="$(CYPRESS_DOCKER_CACHE)"/.gatsby.cache,destination=/client/.cache,consistency=delegated \
		--workdir /client \
	$(CYPRESS_IMAGE)

.PHONY: dependencies-update
dependencies-update:
	npm run dependencies-update

.PHONY: develop
develop: node_modules/gatsby
	npx gatsby develop

.PHONY: pretty
pretty:
	cd .. && $(MAKE) format

.PHONY: format
format:
	cd .. && $(MAKE) format

.PHONY: license
license:
	cd .. && $(MAKE) license

node_modules/cypress:
	$(MAKE) install

node_modules/eslint:
	$(MAKE) install

node_modules/gatsby:
	$(MAKE) install

node_modules/jest:
	$(MAKE) install

node_modules/typescript:
	$(MAKE) install

PHONY: install
install:
	npm ci 

.PHONY: test
test: node_modules/jest
	npm run test

PHONY: test-all
test-all:
	#$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-types

.PHONY: test-audit
test-audit:
	npm run test:audit

.PHONY: test-format
test-format:
	cd .. && $(MAKE) test-format

.PHONY: test-license
test-license:
	cd .. && $(MAKE) test-license

.PHONY: test-lint
test-lint: node_modules/eslint
	npm run test:lint

.PHONY: test-types
test-types: node_modules/typescript
	npm run test:types

.PHONY: test-cypress
test-cypress: node_modules/cypress
	npm run test:cypress
