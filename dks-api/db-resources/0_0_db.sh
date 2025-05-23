#!/bin/bash

# Check if the role exists
ROLE_COUNT=$(psql -U postgres -tAc "SELECT count(rolname) FROM pg_roles WHERE rolname='$DB_ROLE_NAME'")


if [ $ROLE_COUNT -eq 1 ]; then
    # The role exists
    echo "!!!!!!!!! User/role $DB_ROLE_NAME already exists. Skipping creation."

else
    # The role does not exist
    echo "--------  Creating user/role $DB_ROLE_NAME."
    psql -c "CREATE ROLE \"$DB_ROLE_NAME\" WITH LOGIN NOSUPERUSER CREATEDB CREATEROLE INHERIT NOREPLICATION CONNECTION LIMIT -1 PASSWORD '$DB_ROLE_PASSWORD'"
fi


# Check if the database exists
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    # The database exists
    echo "!!!!!!!!  Database $DB_NAME already exists. Skipping creation."
else
    # The database does not exist
    echo "--------  Creating database $DB_NAME"
    createdb -O $DB_ROLE_NAME -E UTF8 -T template0 --locale=en_US.utf8 $DB_NAME
fi
