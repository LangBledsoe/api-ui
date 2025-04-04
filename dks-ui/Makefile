# Check if there is a file named .env in the current directory
ifneq ("$(wildcard .env)","")
  # Include the contents of the .env file in the Makefile
  include .env
  # Export the variables defined in the .env file
  export
endif

export SHA_TAG = $(shell git rev-parse --short HEAD)

BASE_IMAGE = node:20-alpine3.19@sha256:7e227295e96f5b00aa79555ae166f50610940d888fc2e321cf36304cbd17d7d6

# Split Docker run command for flexibility
DOCKER_RUN_CMD = docker run --env-file .env --rm -v "$(PWD)":/app -w /app
DOCKER_RUN_NETWORK_PARAMS = --network frontend

# Format the help output
# 	Headings are defined by lines starting with #--
#	  Targets are defined by lines starting with a target name followed by a colon
#	  Target descriptions are defined by lines starting with '##'
help:
	@grep -E '^[1-9a-zA-Z_-]+:.*?## .*$$|(^#--)' Makefile \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m %-30s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m #-- /[33m/'

# Extract first target passed to make
CMD := $(wordlist 1,1,$(MAKECMDGOALS))

# If the make target is "npm"...
# Parse additional arguments beyond the first target and store them in a variable for later use
ifeq (npm,$(CMD))
  NPM_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn the arguments into do-nothing targets to prevent 'make: Nothing to be done for ...' messages
  $(eval $(NPM_ARGS):;@:)
endif

# Don't define any other targets if we're just trying to run an arbitrary npm command
ifneq ($(CMD),npm)

#-- Dependencies and Build:
install: deps-check ## Install dependencies defined in package.json
	$(DOCKER_RUN_CMD) $(BASE_IMAGE) npm install

ci: deps-check ## Clean install of dependencies defined in package-lock.json
	$(DOCKER_RUN_CMD) $(BASE_IMAGE) npm ci

docker-build: envfile ## Build the production application docker image
	docker build -t $(APP_NAME):$(SHA_TAG) --target runner .

docker-build-dev: deps-check ## Build only the dev layer of the docker image
	docker build -t $(APP_NAME)-dev:$(SHA_TAG) --target dev .

#-- Testing and Scans:
test: deps-check ## Run unit tests
	$(DOCKER_RUN_CMD) $(BASE_IMAGE) npm run test

functional-test: docker-build-dev ## Run functional tests
	$(DOCKER_RUN_CMD) $(DOCKER_RUN_NETWORK_PARAMS) $(APP_NAME)-dev:$(SHA_TAG) npm run wdio

#-- Linting and Formatting:
lint: deps-check ## Run ESLint
	$(DOCKER_RUN_CMD) $(BASE_IMAGE) npm run lint

#-- Execution Control:
dev: deps-check ## Start the application in development mode with hot-code reloading
	@if docker network inspect frontend >/dev/null 2>&1; then \
		$(DOCKER_RUN_CMD) $(DOCKER_RUN_NETWORK_PARAMS) -p $(APP_PORT):$(APP_PORT) --name $(APP_NAME) $(BASE_IMAGE) npm run dev; \
	else \
		docker network create frontend && \
		(trap 'docker network rm frontend' EXIT; \
		$(DOCKER_RUN_CMD) $(DOCKER_RUN_NETWORK_PARAMS) -p $(APP_PORT):$(APP_PORT) --name $(APP_NAME) $(BASE_IMAGE) npm run dev) \
	fi


up: docker-build ## Run the application using Docker Compose
	docker compose up -d $(APP_NAME_UI)

down:# Destroys Docker Compose environment, but preserves volumes
	docker compose down

endif

#-- Development Utilities:
npm: ## Run arbitrary npm commands. NOTE: add '--' after npm if any argument will start with a dash (-) or dashes (--) (e.g. 'make npm -- install --save-dev some-package')
	$(DOCKER_RUN_CMD) $(BASE_IMAGE) npm $(NPM_ARGS)

deps-check:  ## Check that dependencies are installed and configured correctly
	@echo "Running dependency checks..."; \
	HAS_ERROR=false; \
	if ! make envfile; then \
		HAS_ERROR=true; \
	fi; \
	if ! make local-git-hooks; then \
		HAS_ERROR=true; \
	fi; \
	if [ "$$HAS_ERROR" = "true" ]; then \
		echo "$(COLOR_RED)One or more dependency checks failed and/or requires action from you before proceeding!$(COLOR_RESET)"; \
		echo "$(COLOR_RED)Please review the output above for details.$(COLOR_RESET)"; \
		exit 1; \
	else \
		echo "$(COLOR_GREEN)All dependencies are good to go!$(COLOR_RESET) $(TADA)\n\n"; \
	fi

envfile: ## Create .env file from .env.template
	@echo "Checking for existing .env file..."; \
	HAS_ERROR=false; \
	if [ ! -f ./.env ]; then \
		echo "$(COLOR_YELLOW)No .env file found. Creating from '.env.template'...$(COLOR_RESET)"; \
		if cp ./.env.template ./.env; then \
			echo "$(COLOR_GREEN)'.env' file has been created!$(COLOR_RESET) $(CHECKMARK)"; \
			echo "$(COLOR_CYAN)Please review the values in '.env' and update them as necessary before continuing.$(COLOR_RESET)"; \
			echo "$(COLOR_CYAN)Once you have reviewed and updated the values in '.env' you should be good to proceed!$(COLOR_RESET)"; \
			exit 2; \
				else \
					echo "$(COLOR_RED)Failed to create '.env' file!$(COLOR_RESET)"; \
					exit 1; \
				fi; \
	else \
			echo "Environment file found! $(CHECKMARK)"; \
			echo "Checking for missing keys based on keys defined in '.env.template'..."; \
		ENV_TEMPLATE_KEYS=$$(grep -v '^#' ./.env.template | cut -d '=' -f 1); \
		ENV_KEYS=$$(grep -v '^#' ./.env | cut -d '=' -f 1); \
		echo "$$ENV_TEMPLATE_KEYS" | sort > .env_template_keys_sorted; \
		echo "$$ENV_KEYS" | sort > .env_keys_sorted; \
		ENV_TEMPLATE_KEYS_SUBSET=$$(comm -23 .env_template_keys_sorted .env_keys_sorted); \
		rm .env_template_keys_sorted .env_keys_sorted; \
		if [ -n "$$ENV_TEMPLATE_KEYS_SUBSET" ]; then \
			echo "$(COLOR_RED)Environment file is missing the following keys: $(COLOR_RESET)"; \
			echo "$(COLOR_RED)$$ENV_TEMPLATE_KEYS_SUBSET$(COLOR_RESET)"; \
			HAS_ERROR=true; \
		else \
			echo "Environment file has all required keys! $(CHECKMARK)"; \
		fi; \
	fi; \
	if [ "$$HAS_ERROR" = "false" ]; then \
		echo "$(COLOR_GREEN)Environment file is good to go!$(COLOR_RESET) $(TADA)"; \
	else \
		echo "$(COLOR_RED)\nEnvironment file is not configured correctly!$(COLOR_RESET)"; \
		echo "$(COLOR_RED)Please fix the errors above and try again.$(COLOR_RESET)"; \
		exit 1; \
	fi;

local-git-hooks: ## Setup local Git hooks (see https://pre-commit.com/#install for pre-commit installation instructions)
ifeq ($(CI),true)
	@echo "Running in CI, skipping dependency check"
else
	@echo "Checking for pre-commit binary..."; \
	if [ -z $$(which pre-commit) ]; then \
		echo "$(COLOR_RED)No pre-commit binary found in PATH.$(COLOR_RESET)"; \
		echo "$(COLOR_YELLOW)Please install the pre-commit binary using Homebrew or Python's package manager pip or pip3.$(COLOR_RESET)"; \
		echo "\t$(COLOR_YELLOW)brew install pre-commit$(COLOR_RESET)"; \
		echo "\t$(COLOR_YELLOW)pip3 install pre-commit$(COLOR_RESET)"; \
		echo "$(COLOR_YELLOW)See https://pip.pypa.io/en/stable/installation/ if you don't have pip or pip3$(COLOR_RESET)"; \
		exit 1; \
	else \
		echo "Pre-commit binary found at '$$(which pre-commit)'! $(CHECKMARK)"; \
	fi; \
	echo "Ensuring pre-commit is installed for each hook type defined in '.pre-commit-config.yaml'..."; \
	if pre-commit install --install-hooks --overwrite; then \
		echo "$(COLOR_GREEN)Git hooks are good to go!$(COLOR_RESET) $(TADA)"; \
	else \
		echo "$(COLOR_RED)Git hooks were not configured correctly!$(COLOR_RESET)"; \
		echo "$(COLOR_RED)Please fix the errors above and try again.$(COLOR_RESET)"; \
		exit 1; \
	fi
endif

# NOTE .PHONY denotes that the target does _not_ correspond to any local file of the same name (true of all our targets)
.PHONY: $(MAKECMDGOALS)

# Define color escape codes
COLOR_RESET = \033[0m
COLOR_CYAN = \033[36m
COLOR_GREEN = \033[32m
COLOR_RED = \033[31m
COLOR_YELLOW = \033[33m

# Define Unicode characters for emojis
CHECKMARK = \xE2\x9C\x85  # Checkmark emoji
TADA = \xF0\x9F\x8E\x89 # Tada emoji
RED_X = \xE2\x9D\x8C # Red X emoji
