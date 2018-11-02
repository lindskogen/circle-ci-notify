# circle-ci-notify

Notify you (with terminal bell) of latest build status on circle-ci

## Usage

```bash
# Setup instructions


# With yarn
yarn global add circle-ci-notify
# or npm
npm install -g circle-ci-notify

# then set CIRCLECI_API_TOKEN in .bashrc or .zshrc
export CIRCLECI_API_TOKEN=your_token

# Use like this:
circle-ci-notify organization/repo [branch] # defaults to master
```

## Example run

```
circle-ci-notify lindskogen/circle-ci-notify master
master: running
master: running
master: running
master: running
master: running
master: success
```
