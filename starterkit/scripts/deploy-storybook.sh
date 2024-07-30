#!/bin/bash

cd "${0%/*}"

echo "---"
echo "deploying to https://interactive.zeit.de/g/storybook/"
echo "---"

# copy all files
# compare checksums so only files with changed content are copied
# to prevent uncaching them
# rsync --rsync-path="mkdir -p /srv/infographics/web/storybook && rsync" -r -v --checksum --human-readable ../../storybook-static/* "infographics@infographics.zeit.de:/srv/infographics/web/storybook/."
gsutil rsync -r ../../storybook-static gs://assets-interactive/g/storybook
