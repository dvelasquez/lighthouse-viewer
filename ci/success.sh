#!/bin/sh

setup_git() {
  git config --global user.email "danilo.velasquez@gmail.com"
  git config --global user.name "Danilo Velasquez"
  git remote set-url origin "https://${GITHUB_API_TOKEN}@github.com/dvelasquez/lighthouse-viewer.git" > /dev/null 2>&1
}

setup_npm() {
  echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" >> $HOME/.npmrc 2> /dev/null
  npm config set access public
}

release () {
  echo "Releasing new version to NPM"
  git checkout "$TRAVIS_BRANCH"
  git reset --hard
  npm run lerna:release
  npm run lerna:publish
}

release_canary () {
  echo "Releasing new canary version to NPM"
  git checkout "$TRAVIS_BRANCH"
  git reset --hard
  npm run lerna:release
  npm run lerna:publish:canary
}

commit_demo () {
  echo "Updating DEMO"

  git push origin --delete gh-pages
  git checkout -b gh-pages

  echo "Building demo page"
  npm run demo:build
  git add .
  git commit -m "doc(demo): updating demo page"
  git subtree push --prefix demo origin gh-pages
}

if [[ "$TRAVIS_BRANCH" = "main" && "$TRAVIS_PULL_REQUEST" = "false" ]]; then
  setup_git
  setup_npm
  commit_demo
  release
fi
# The following script will only run for the branch "build/ci", so we can test our changes
if [[ "$TRAVIS_BRANCH" = "build/monorepo-multipackage" && "$TRAVIS_PULL_REQUEST" = "false" ]]; then
  setup_git
  setup_npm
  release_canary
fi
# script to test demo page
if [[ "$TRAVIS_BRANCH" = "docs/improve-demo" && "$TRAVIS_PULL_REQUEST" = "false" ]]; then
  setup_git
  commit_demo
fi

