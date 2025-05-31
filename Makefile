PROJECT_NAME = hackathon

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
	docker exec -it $(PROJECT_NAME)_backend_1 sh

shell-frontend:
	docker exec -it $(PROJECT_NAME)_frontend_1 sh

shell-features:
	docker exec -it $(PROJECT_NAME)_features_1 sh

prune:
	docker system prune -af --volumes

build-backend:
	docker-compose build backend

build-frontend:
	docker-compose build frontend

build-features:
	docker-compose build features

.PHONY: up down rebuild logs ps shell-backend shell-frontend shell-features prune build-backend build-frontend build-features

