DOCKER_IMAGE?=opentutor-home
OPENTUTOR_CLIENT_VERSION?=latest
TEST_E2E_DOCKER_COMPOSE=docker-compose

.PHONY: clean
clean:
	cd client && $(MAKE) clean

.PHONY: develop
develop:
	cd client && $(MAKE) develop

.PHONY docker-build:
docker-build:
	docker build \
		--file docker/Dockerfile \
		-t $(DOCKER_IMAGE) \
	.

node_modules/license-check-and-add:
	npm ci

node_modules/prettier:
	npm ci

.PHONY: pretty
pretty: node_modules/prettier
	npm run format

LICENSE:
	@echo "you must have a LICENSE file" 1>&2
	exit 1

LICENSE_HEADER:
	@echo "you must have a LICENSE_HEADER file" 1>&2
	exit 1

.PHONY: format
format: node_modules/prettier LICENSE LICENSE_HEADER
	npm run license:fix && npm run format

.PHONY: license
license: LICENSE LICENSE_HEADER
	npm run license:fix

.PHONY: license-deploy
license-deploy: node_modules/license-check-and-add LICENSE LICENSE_HEADER
	LICENSE_CONFIG=${LICENSE_CONFIG} npm run license:deploy

.PHONY: test
test:
	cd client && $(MAKE) test

.PHONY: test-all
test-all:
	#$(MAKE) test-audit
	$(MAKE) test-format
	$(MAKE) test-lint
	$(MAKE) test-license
	$(MAKE) test-types

.PHONY: test-audit
test-audit:
	cd client && $(MAKE) test-audit

.PHONY: test-format
test-format: node_modules/prettier
	npm run test:format

.PHONY: test-lint
test-lint:
	cd client && $(MAKE) test-lint

.PHONY: test-types
test-types:
	cd client && $(MAKE) test-types

.PHONY: test-license
test-license: LICENSE LICENSE_HEADER
	npm run test:license

.PHONY: test-e2e
test-e2e:
	cd cypress && rm -rf cypress/screenshots
	$(MAKE) test-e2e-build
	$(MAKE) test-e2e-up
	# $(MAKE) test-e2e-exec

.PHONY: test-e2e-build
test-e2e-build:
	$(TEST_E2E_DOCKER_COMPOSE) build

.PHONY: test-e2e-up
test-e2e-up:
	$(TEST_E2E_DOCKER_COMPOSE) up --abort-on-container-exit --exit-code-from e2e
