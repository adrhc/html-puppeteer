#!/bin/bash

RSYNCB_linux="rsync -cEhimprt --delete-after --ignore-errors"
RSYNCB_linux_KL="$RSYNCB_linux --delete-excluded -l"

TARGET_DIR="/home/adr/apps/opt/apache-htdocs/jquery-widgets"

mkdir -p $TARGET_DIR

RSYNC_CMD="$RSYNCB_linux_KL" $HOME/x.sh basicRaid ./ $TARGET_DIR "--exclude=.git --exclude=.gitignore"
