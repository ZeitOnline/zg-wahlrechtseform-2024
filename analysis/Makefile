################################################################################
# Macht environment Variablen verfügbar
################################################################################
-include .env
-include .env.shared

################################################################################
# Hauptbefehle, die die einzelnen Schritte in der richtigen Reihenfolge ausführen
################################################################################
.PHONY: all
all: example_python \
	example_r \
	example_js \
	sync

################################################################################
# Hier listen wir alle Scripts auf, die dieses Projekt hat
################################################################################
.PHONY: example_python
example_python:
	venv/bin/python scripts/example.py

.PHONY: example_r
example_r:
	Rscript --vanilla scripts/example_r.R

.PHONY: example_js
example_js:
	node scripts/process.mjs

################################################################################
# Export, kopiert einzelne Dateien ins Frontend. Um sync im Anschluss an ein
# Skript auszuführen häng dem Code @$(MAKE) sync als zusätzliche Zeile an
################################################################################

.PHONY: sync
sync:
	rsync -a export/beispiel.json ../src/static/data/;

################################################################################
# Installations-Geschichten
################################################################################

.PHONY: generate_readme_for_data
generate_readme_for_data:
	node core/generate_readme_for_data.mjs

###### Python Installation ######
# Check if pyenv is installed
.PHONY check_pyenv:
	@if command -v pyenv 2>/dev/null; then \
		echo "pyenv is already installed. Continuing with the installation..."; \
	else \
		echo "pyenv is not installed. Please follow the instructions at https://github.com/pyenv/pyenv#installation to install pyenv."; \
		exit 1; \
	fi

# Install Python version if not installed
.PHONY: install_python
install_python:
	@if pyenv versions --bare | grep -q `cat .python-version`; then \
		echo "Python `cat .python-version` is already installed. Continuing with the installation..."; \
	else \
		echo "Installing Python `cat .python-version` using pyenv..."; \
		pyenv install `cat .python-version`; \
	fi

# Remove existing venv
.PHONY: remove_venv
remove_venv:
	rm -rf venv; \

# Python Setup, requires pyenv, but if not installed it will tell you how to install it.
.PHONY: setup_python
setup_python: remove_venv check_pyenv install_python
	python3 -m venv venv; \
	. venv/bin/activate; \
  pip install --upgrade pip; \
	pip install -r requirements.txt

.PHONY: update_python
update_python:
	. venv/bin/activate; \
	pip install --upgrade pip; \
	pip install -r requirements.txt; \
	deactivate

###### R Installation ######
# R installation
.PHONY: install_r
install_r:
	Rscript --vanilla packages.R

###### Node Installation ######
# Node Installation
.PHONY: install_node
install_node:
	npm install

###### All Installations ######
install: setup_python install_r install_node
