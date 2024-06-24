#!/usr/bin/env bash
# Use this script to test if a given TCP host/port are available

HOST=$1
PORT=$2
shift 2
TIMEOUT=${TIMEOUT:-15}
QUIET=0
CHILD=0

echoerr() {
  if [[ $QUIET -ne 1 ]]; then echo "$@" 1>&2; fi
}

usage() {
  cat << USAGE >&2
Usage:
  $0 host port [-t timeout] [-- command args]
  -q | --quiet                        Do not output any status messages
  -t TIMEOUT | --timeout=timeout      Timeout in seconds, zero for no timeout
  -- COMMAND ARGS                     Execute command with args after the test finishes
USAGE
  exit 1
}

wait_for() {
  if [[ $TIMEOUT -gt 0 ]]; then
    echoerr "$0: waiting $TIMEOUT seconds for $HOST:$PORT"
  else
    echoerr "$0: waiting for $HOST:$PORT without a timeout"
  fi
  start_ts=$(date +%s)
  while :
  do
    if [[ $ISBUSY -eq 1 ]]; then
      nc -z $HOST $PORT
      result=$?
    else
      (echo > /dev/tcp/$HOST/$PORT) >/dev/null 2>&1
      result=$?
    fi
    if [[ $result -eq 0 ]]; then
      end_ts=$(date +%s)
      echoerr "$0: $HOST:$PORT is available after $((end_ts - start_ts)) seconds"
      break
    fi
    sleep 1
  done
  return $result
}

wait_for_wrapper() {
  # In order to support SIGINT during timeout: http://unix.stackexchange.com/a/57692
  if [[ $QUIET -eq 1 ]]; then
    timeout $TIMEOUT $0 $HOST $PORT --quiet --child --timeout=$TIMEOUT &
  else
    timeout $TIMEOUT $0 $HOST $PORT --child --timeout=$TIMEOUT &
  fi
  PID=$!
  trap "kill -INT -$PID" INT
  wait $PID
  RESULT=$?
  if [[ $RESULT -ne 0 ]]; then
    echoerr "$0: timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
  fi
  return $RESULT
}

if [[ $# -lt 2 ]]; then
  usage
fi

HOST=$1
PORT=$2
shift 2

while [[ $# -gt 0 ]]
do
  case "$1" in
    *:* )
    HOST=${1%%:*}
    PORT=${1##*:}
    shift 1
    ;;
    -q | --quiet)
    QUIET=1
    shift 1
    ;;
    -t)
    TIMEOUT="$2"
    if [[ $TIMEOUT == "" ]]; then break; fi
    shift 2
    ;;
    --timeout=*)
    TIMEOUT="${1#*=}"
    shift 1
    ;;
    --child)
    CHILD=1
    shift 1
    ;;
    --)
    shift
    break
    ;;
    *)
    echoerr "Unknown argument: $1"
    usage
    ;;
  esac
done

ISBUSY=$(which busybox >/dev/null 2>&1; echo $?)

if [[ $CHILD -gt 0 ]]; then
  wait_for
  RESULT=$?
  exit $RESULT
else
  if [[ $TIMEOUT -gt 0 ]]; then
    timeout $TIMEOUT $0 $HOST $PORT --child --timeout=$TIMEOUT "$@"
    RESULT=$?
  else
    wait_for
    RESULT=$?
  fi
fi

if [[ $# -gt 0 ]]; then
  exec "$@"
else
  exit $RESULT
fi
