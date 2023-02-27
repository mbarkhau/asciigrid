SHELL := /bin/bash
.SHELLFLAGS := -O extglob -eo pipefail -c


.PHONY: deploy
deploy:
	rsync -a . mbarkhau@vserver:/var/www/html/asciigrid-litprog-dev/


.PHONY: venv
venv:
	@mkdir -p ~/pyenvs
	python3 -m venv ~/pyenvs/asciigrid
	~/pyenvs/asciigrid/bin/python -m pip install -r requirements.txt
	echo "To activate venv:"
	echo ""
	echo "	source ~/pyenvs/asciigrid/bin/activate"


.PHONY: devhttp
devhttp:
	ASCIIGRID_DEBUG=1 ~/pyenvs/asciigrid/bin/flask run --port 4000 --reload


.PHONY: docker
docker:
	docker build -t asciigrid .
	docker run -p 4000:80 -p 4001:4001 -it asciigrid
