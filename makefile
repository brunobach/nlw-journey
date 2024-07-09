STACK_NAME=dev-journey

docker-start:
	docker-compose -p ${STACK_NAME} up -d --remove-orphans

docker-stop:
	docker-compose -p ${STACK_NAME} stop

docker-restart: stop start

docker-clean:
	docker-compose -p ${STACK_NAME} down -v

migrate:
	tern migrate --migrations ./internal/pgstore/migrations/ --config ./internal/pgstore/migrations/tern.conf 

migrate-new:
	tern new --migrations ./internal/pgstore/migrations/ $(name)