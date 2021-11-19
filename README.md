# Base Jupyter Notebook Stack

[![docker pulls](https://img.shields.io/docker/pulls/jupyter/base-notebook.svg)](https://hub.docker.com/r/jupyter/base-notebook/)
[![docker stars](https://img.shields.io/docker/stars/jupyter/base-notebook.svg)](https://hub.docker.com/r/jupyter/base-notebook/)
[![image size](https://img.shields.io/docker/image-size/jupyter/base-notebook/latest)](https://hub.docker.com/r/jupyter/base-notebook/ "jupyter/base-notebook image size")

GitHub Actions in the <https://github.com/jupyter/docker-stacks> project builds and pushes this image to Docker Hub.

Please visit the project documentation site for help using and contributing to this image and others.

- [Jupyter Docker Stacks on ReadTheDocs](https://jupyter-docker-stacks.readthedocs.io/en/latest/index.html)
- [Selecting an Image :: Core Stacks :: jupyter/base-notebook](https://jupyter-docker-stacks.readthedocs.io/en/latest/using/selecting.html#jupyter-base-notebook)


## 產生新的 image
docker build -t jupyter/webai .

## 執行 jupyter-webai
docker run --name jupyter-webai -d -v /Users/marty/webai_board-builder/opt/jupyter-webai:/home/jovyan/— -p 8888:8888 jupyter/webai


## enter container
docker run --name jupyter-webai -e GRANT_SUDO=yes --user root -it -v /Users/marty/webai_board-builder/opt/jupyter-webai:/home/jovyan/— -p 8888:8888 jupyter/webai bash
