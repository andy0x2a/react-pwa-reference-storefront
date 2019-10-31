#!/bin/bash
publishDirName="components"
isChanged=$(
    # Difference in 2 last commits
    git diff --name-only HEAD^ HEAD |
    # Get only that starts with components so only component folder
    grep "^${publishDirName}/" |
    # Get first one
    head -1 |
    # Cut all after /
    cut -d / -f 1
)

if [[ ${isChanged} == ${publishDirName} ]]
then
    git checkout RS-516-automate-version-increment
    npm version patch  -m "Components %s skip_ci"
    # git push
    # npm publish components/
    exit 0
fi
echo "components not published"
