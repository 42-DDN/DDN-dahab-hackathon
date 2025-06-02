PROJECT_NAME = DDN_DAHAB_HACKATHON

up:
	docker-compose up -d
down:
	docker-compose down

rebuild:
	docker-compose down --volumes
	docker-compose build
	docker-compose up -d
logs:
	docker-compose logs -f
ps:
	docker-compose ps

shell-backend:
	docker exec -it backend sh

shell-frontend:
	docker exec -it frontend sh

shell-backend:
	docker exec -it frontend sh

shell-features:
	docker exec -it features sh

build-frontend:
	docker-compose build frontend

build-features:
	docker-compose build features

.PHONY: up down rebuild logs ps shell-frontend shell-features build-backend build-frontend build-features

