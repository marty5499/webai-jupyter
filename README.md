## 產生新的 image
docker build -t jupyter/webai .

## 執行 jupyter-webai
docker run --name jupyter-webai -d -v ${PWD}/work:/home/jovyan/— -p 8888:8888 jupyter/webai

## 進入 jupyter-webai container
docker run --name jupyter-webai -e GRANT_SUDO=yes --user root -it -v ${PWD}/work:/home/jovyan/— -p 8888:8888 jupyter/webai bash
