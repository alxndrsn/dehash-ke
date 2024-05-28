#!/bin/bash -eu
set -o pipefail

log() { echo >&2 "[test] $*"; }

log "File limit (soft):"
ulimit -n
log "File limit (hard):"
ulimit -Hn
prlimit --pid $$ --nofile=128000

hashDir=dist/v1/phone/sha256

log "Running code..."
DEV=1 node ./src/generate-hashes.js

log "Checking generated file count..."
fileCount="$(find "$hashDir" -type f | wc -l)"
log "  Got: $fileCount"
if ! [[ "$fileCount" -eq 65536 ]]; then
  log "!!! Unexpected count for hash files!"
  exit 1
fi
log "  OK!"

log "Checking generated file size..."
totalSize="$(du -sb "$hashDir" | cut -f1)"
log "  Got: $totalSize"
if ! [[ "$totalSize" -eq 157978368 ]]; then
  log "!!! Unexpected size for hash data!"
  exit 1
fi
log "  OK!"

log "Checking known hashes..."
check_hash() {
  hash="$1"
  expected="$2"
  prefix="${1:0:4}"
  key="${1:4}"
  actual="$(jq -r ".\"$key\"" "$hashDir/$prefix.json")"
  if [[ "$actual" != "$expected" ]]; then
    echo "!!! Incorrect phone number found for '$hash'"
    echo "!!!   Expected: $expected"
    echo "!!!     Actual: $actual"
    exit 1
  fi
}
check_hash 000017e2e559c3533ec174952d2658014f5411753def36ab7031265350db8949 254110007012
check_hash 0000d37ae3c7d7d040afcab0442233e599bf961831c90ba4c0c529eaabcd590e 254111823948
check_hash ffff029424660707b57f209524b59a56ab23078995a6afcc3f329237ccbf92ab 254110101598
check_hash ffff7704e9784eb116f36a59990638824d4ba81ff1f9677daa459d269bbf4547 254111987581
log "  OK!"

log "All OK!"
