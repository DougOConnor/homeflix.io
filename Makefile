# Homeflix — build & publish
#
# The image is secret-free; TMDB_TOKEN is provided at runtime.
# Override any of these, e.g.:  make build VERSION=1.2.0

OWNER    ?= douglasoconnor
IMAGE    ?= $(OWNER)/homeflix.io
VERSION  ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)

# TMDB key for `make run`: environment wins, else fall back to the local
# gitignored app/api/auth.json used for dev.
TMDB_TOKEN ?= $(shell node -e "try{process.stdout.write(require('./app/api/auth.json').tmdb_token||'')}catch(e){}" 2>/dev/null)
ENV_FILE   := $(wildcard app/.env)

.PHONY: help build run push release login dev-backend dev-frontend

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

build: ## Build the Docker image (tagged VERSION + latest)
	docker build -t $(IMAGE):$(VERSION) -t $(IMAGE):latest .

run: build ## Build then run locally on :8081 (TMDB_TOKEN from env, app/.env, or app/api/auth.json)
	docker run --rm -it \
		-p 8081:8080 \
		$(if $(ENV_FILE),--env-file $(ENV_FILE)) \
		$(if $(TMDB_TOKEN),-e TMDB_TOKEN=$(TMDB_TOKEN)) \
		-v homeflix-data:/app/data \
		$(IMAGE):latest

push: ## Push VERSION + latest tags to the registry
	docker push $(IMAGE):$(VERSION)
	docker push $(IMAGE):latest

release: build push ## Build and push in one step

login: ## Log in to Docker Hub (needs an access token in DOCKERHUB_TOKEN)
	@echo "$$DOCKERHUB_TOKEN" | docker login -u $(OWNER) --password-stdin

dev-backend: ## Run the backend locally
	cd app && node index.js

dev-frontend: ## Run the frontend dev server locally
	cd app/frontend && npm start
