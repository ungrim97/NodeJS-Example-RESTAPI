#!/bin/sh
# wait-for-db.sh

set -e
cmd="$@"

echo "mysqladmin ping -h $MS_DB_HOST -p -u $MS_DB_USER --silent"
echo $cmd
until mysqladmin ping -h $MS_DB_HOST -p$MS_DB_PASS -u $MS_DB_USER --silent; do
  >&2 echo "$?: Mysql is unavailable - sleeping"
    sleep 1
done

>&2 echo "Mysql is up - executing command"
exec $cmd
