#!/bin/bash

#
# Entry-point for a container
#
# Copyright 2020 Human Dataware Lab. Co. Ltd.
# Created by Daiki Hayashi (hayashi.daiki@hdwlab.co.jp)
#

set -e
set -x

DIR=$(cd $(dirname ${0}) && pwd)

export PATH=${DIR}:${PATH}
export NODE_PATH=$(npm root -g):${NODE_PATH}

while read langdir
do
    langdir_name=$(realpath --relative-to="/opt/docs" "${langdir}")

    # Generate _navbar.md in each language-directory
    echo "Generating _navbar.md of \"${langdir}\""
    init.js generate_navbar "\"${langdir}\"" \
      --url_prefix "/${langdir_name}/" \
      --header "Documents" \
      > "${langdir}/_navbar.md"

    # Generate _sidebar.md in each language-directory
    echo "Generating _sidebar.md of \"${langdir}\""
    init.js generate_sidebar "\"${langdir}\"" \
      --maxdepth 1 \
      --url_prefix "\"/${langdir_name}/\"" \
      > "${langdir}/_sidebar.md"

    while read subdir
    do
        # Generate _sidebar.md in each database-directory
        subdir_name=$(basename "${subdir}")
        echo "Generating _sidebar.md of \"${subdir}\""
        init.js generate_sidebar "\"${subdir}\"" \
          --maxdepth 3 \
          --include_self \
          --include_parent \
          --url_prefix "\"/${langdir_name}/${subdir_name}/\"" \
          > "${subdir}/_sidebar.md"
    done <<< $(find ${langdir} -mindepth 1 -maxdepth 1 -type d)
done <<< $(find /opt/docs/contents -mindepth 1 -maxdepth 1 -type d)

