#!/bin/bash

# https://github.com/facebook/react-native/issues/18775#issuecomment-414587200
if ! patch -Rsfp0 --dry-run < WebSocketModule.java_patch; then 
 patch -p0 < WebSocketModule.java_patch
fi

git update-index --skip-worktree App/Config/DebugNetConfig.js 




