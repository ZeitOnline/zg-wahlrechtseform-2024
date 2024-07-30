#!/bin/bash
set -e
cd "${0%/*}"

export PYTHONIOENCODING=utf8

# read deployment path from starter kit config
# via python’s json decoder, because bash doesn’t have one
# and everyone’s got python installed, right?
DEPLOYMENT_PATH=`echo "$(<../../src/__starterkit_config.json )" | python3 -c "import sys, json; print(json.load(sys.stdin)['deploymentPath'])"`

if [ ! -z "$STAGING" ]
  then
    DEPLOYMENT_PATH="staging/$DEPLOYMENT_PATH"
fi

# CPUS=`getconf _NPROCESSORS_ONLN`
# CPUS="$(($CPUS-2))"
CPUS="4"

echo "------"
echo "Deploying to https://interactive.zeit.de/g/$DEPLOYMENT_PATH"

# copy to google cloud storage (gcs)
# expects gsutil to authentificated as user/service-account who can write to $GCS_BUCKET
GCS_BUCKET=gs://assets-interactive/g

Yellow='\033[0;33m'
NC='\033[0m'

echo -e "${Yellow}--- Deploying js/css/assets ---${NC}"
# everything in dist/client except map tiles (.pbf)
gsutil -h "Cache-Control: public, max-age=31536000" -m -o "GSUtil:parallel_process_count=$CPUS" rsync -j html,txt,css,js,mjs,json,xml,csv -r -c -x ".*\.gitignore|.*\.DS_Store|.*\.pbf|.*no-cache.*" ../../dist/client $GCS_BUCKET/$DEPLOYMENT_PATH/static

if [ -d "../../src/maptiles" ]; then
  for file in ../../src/maptiles/*.json; do
    # Read the path from the json file
    MAPTILES_FOLDER=$(cat "$file" | grep -o "zon-tiles://.*" | sed "s/zon-tiles:\/\///" | sed "s/\".*//")
    # Check if it already exists on gcs
    if gsutil -q stat $GCS_BUCKET/$DEPLOYMENT_PATH/static/maptiles/$MAPTILES_FOLDER/metadata.json ; then
      echo -e "${Yellow}--- skipping maptiles directory $MAPTILES_FOLDER as it already exist on gcs ---${NC}"
    else
      echo -e "${Yellow}--- Deploying maptiles ---${NC}"

      # map tiles (.pbf) with the right headers
      gsutil -h "Cache-Control: public, max-age=31536000" -h "Content-Type: application/x-protobuf" -h "Content-Encoding: gzip" -m -o "GSUtil:parallel_process_count=$CPUS" rsync -j pbf -r -c -x "(?!^.+\.pbf$)" ../../src/maptiles $GCS_BUCKET/$DEPLOYMENT_PATH/static/maptiles

      # map tiles meta-data.json files
      gsutil -h "Cache-Control: public, max-age=31536000" -m -o "GSUtil:parallel_process_count=$CPUS" rsync -j json -r -c -x "(?!^.+\.json$)" ../../src/maptiles $GCS_BUCKET/$DEPLOYMENT_PATH/static/maptiles
    fi
  done
fi

echo -e "${Yellow}--- Deploying non-cached files ---${NC}"
# non-cached files with the right headers
gsutil -h "Cache-Control: public, max-age=10" -m -o "GSUtil:parallel_process_count=$CPUS" rsync -j pbf -r -c -x "(?!^.*no-cache.*$)" ../../dist/client $GCS_BUCKET/$DEPLOYMENT_PATH/static

echo -e "${Yellow}--- Deploying static html ---${NC}"
# html with low cache max-age
gsutil -h "Cache-Control: public, max-age=10" -m -o "GSUtil:parallel_process_count=$CPUS" rsync -j html -r -c -x ".*\.gitignore|.*\.DS_Store" ../../dist/static-html $GCS_BUCKET/$DEPLOYMENT_PATH/static-html
