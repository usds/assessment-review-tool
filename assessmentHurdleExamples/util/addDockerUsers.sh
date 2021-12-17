#!/bin/bash
: "${HOST?Need to set HOST}";
: "${TOKEN?Need to set TOKEN}";
: "${HA_ID?Need to set HA_ID}";
export USERS_FILE="./util/users.json";
# update all SME/HR
printf "\nAdding users for the hiring action\n";

HTTP_CODE=$(curl --write-out '%{http_code}' --silent --output /dev/null -X PUT -H "Authorization: token ${TOKEN}" -H "Content-Type: application/json" -d @${USERS_FILE} ${HOST}/api/assessment-hurdle/${HA_ID}/users);

if [ $HTTP_CODE \> 299 ]; then exit 1; fi;
