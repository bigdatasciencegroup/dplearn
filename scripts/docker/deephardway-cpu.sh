#!/usr/bin/env bash
set -e

if ! [[ "$0" =~ "./scripts/docker/deephardway-cpu.sh" ]]; then
  echo "must be run from repository root"
  exit 255
fi

LOCAL_DIR=/var/lib/etcd
if [[ $(uname) = "Darwin" ]]; then
  echo "Running locally with MacOS"
  LOCAL_DIR=/tmp/etcd
  rm -rf /tmp/etcd
fi

if [[ "${DATA_DIR}" ]]; then
  echo DATA_DIR is defined: \""${DATA_DIR}"\"
else
  echo DATA_DIR is not defined
  exit 255
fi

# -P
# -p hostPort:containerPort
# -p 80:80
# -p 4200:4200
docker run \
  --rm \
  -it \
  --volume=${LOCAL_DIR}:/var/lib/etcd \
  --volume=${HOME}/.keras/datasets:/root/.keras/datasets \
  -p 4200:4200 \
  gcr.io/deephardway/deephardway:latest-cpu \
  /bin/sh -c "pushd /gopath/src/github.com/gyuho/deephardway && ./scripts/run/deephardway-cpu.sh"
