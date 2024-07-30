# Python Setup

Wir verwenden neben JS (node) und R auch Python, um Analysen durchzuführen und Daten zu transformieren. Analyse-Code in Python wird dabei immer im `analysis`-Ordner im Starterkit abgelegt.

## Python Installation

Zur Verwaltung von Python-Versionen verwenden wir Pyenv, ähnlich wie NVM bei JavaScript. Der Vorteil besteht darin, dass man einfach zwischen verschiedenen Python-Versionen wechseln kann und über die Datei `.python_version` die Python-Version in einem Projekt festlegen kann.

### Pyenv Installation

**Via Brew**
```bash
brew update
brew install pyenv
```

**Pyenv in der ZSH-Shell initialisieren**
```bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
source ~/.zshrc
```

**Testen, ob alles funktioniert**
```bash
which pyenv
```

**Haupt-Python-Version installieren**
```bash
pyenv install 3.10.12
pyenv global 3.10.12
```

## Erklärung des Analysis-Ordners

Im `analysis`-Ordner kann nun über `make setup_python` ein neues virtuelles Umgebung (venv) installiert werden. Um Pakete hinzuzufügen, können diese einfach in die `requirements.txt` geschrieben und `make update_python` ausgeführt werden. Idealerweise sollte auch immer die Version des Pakets angegeben werden.

Nun kann man in VS Code einfach Skripte über den "Play"-Button ausführen, und wenn man ein Jupyter-Notebook erstellt, wird automatisch die virtuelle Umgebung aus dem `analysis`-Ordner empfohlen, die auch verwendet werden sollte.

Wenn das Python-Skript fertig ist, kann man es in das Makefile wie folgt aufnehmen:

```makefile
.PHONY: example_python
example_python:
	venv/bin/python scripts/example.py
```

Als letzter Schritt wird das Skript in `make all` integriert:

```makefile
.PHONY: all
all: previous_scripts \
	example_python
```
