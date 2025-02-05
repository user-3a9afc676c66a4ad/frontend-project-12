install:
	npm ci && make -C frontend install

build: 
	make install && npm run build

start:
	npm run start

start-frontend:
	cd frontend && npm start

develop:
	make start & make start-frontend

lint:
	make -C frontend lint