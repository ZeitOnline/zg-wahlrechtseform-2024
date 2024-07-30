#! /bin/bash
script_dir=$(dirname $0)
cd $script_dir

# loop trough each directory in projects folder
for d in projects/*; do
  # if directory is not empty
  if [ -n "$(ls -A $d)" ]; then
    project_name=$(basename $d)
    # if directory contains a raster file
    if [ -n "$(find $d -maxdepth 1 -type f -name '*.tif')" ]; then
      raster_file=$(find $d -maxdepth 1 -type f -name '*.tif')
      # create folder in src/public
      mkdir -p ../src/public/$project_name
      # convert raster to tiles
      gdal2tiles.py -z 0-18 $raster_file ../src/public/$project_name
    fi
  fi
done
