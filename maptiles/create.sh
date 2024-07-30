#!/bin/bash

set -e
cd "${0%/*}"
BASE_DIR="$(dirname $0)"
OUTPUT_DIR="$PWD/../src/maptiles"
DATA_DIR="$PWD/data.geojson"
PROJECTS_DIR="$PWD/projects"

echo "$OUTPUT_DIR"

cd $PROJECTS_DIR

for project in * ; do
  echo "$project"
    rm -rf $OUTPUT_DIR/$project*
    PROJECT_DATA="$project/data.geojson"
    echo "Processing project: $project"

    PROJECT_OUTPUT_DIR="${OUTPUT_DIR}/$project"
    mkdir -p $PROJECT_OUTPUT_DIR

    tippecanoe -Z1 -z12 --generate-ids --force --layer=data --detect-shared-borders --output-to-directory=$PROJECT_OUTPUT_DIR ${PROJECT_DATA} --name $project --description --no-tile-size-limit --coalesce --no-tile-stats""
done


# @TODO
# Unless you specify --no-tiny-polygon-reduction, any polygons that are smaller than a minimum area (currently 4 square subpixels) will have their probability diffused, so that some of them will be drawn as a square of this minimum size and others will not be drawn at all, preserving the total area that all of them should have had together.

# Features in the same tile that share the same type and attributes are coalesced together into a single geometry if you use --coalesce. You are strongly encouraged to use -x to exclude any unnecessary attributes to reduce wasted file size.

