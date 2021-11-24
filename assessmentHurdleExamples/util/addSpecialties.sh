#!/bin/bash
: "${HOST?Need to set HOST}";
: "${TOKEN?Need to set TOKEN}";
: "${AGENCY_DIR?Need to set AGENCY_DIR}";
: "${HA_ID?Need to set HA_ID}";

# Add specialties and competencies.
printf "\nAdding competencies\n";

HTTP_CODE=$(curl --write-out '%{http_code}' --silent --output /dev/null  -X PUT -H "Authorization: token ${TOKEN}" -H "Content-Type: application/json" -d @${AGENCY_DIR}/competencies.json ${HOST}/api/assessment-hurdle/${HA_ID}/competencies);

if [ $HTTP_CODE \> 299 ]; then exit 1; fi;

printf "\nAdding specialties\n";

HTTP_CODE=$(curl --write-out '%{http_code}' --silent --output /dev/null  -X PUT -H "Authorization: token ${TOKEN}" -H "Content-Type: application/json" -d @${AGENCY_DIR}/specialties.json ${HOST}/api/assessment-hurdle/${HA_ID}/specialties);

if [ $HTTP_CODE \> 299 ]; then exit 1; fi;

