SHELL := /bin/bash
.SHELLFLAGS := -O extglob -eo pipefail -c


.PHONY: deploy
deploy:
	cp -r ./* /run/user/1000/keybase/kbfs/public/mbarkhau/asciigrid/


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
	ASCIIGRID_DEBUG=1 \
		~/pyenvs/asciigrid/bin/flask run --port 8000 --reload
