#!/bin/bash
: "${HOST?Need to set HOST}";
: "${TOKEN?Need to set TOKEN}";
: "${APPLICANTS_FILE?Need to set APPLICANTS_FILE}";
: "${HA_ID?Need to set HA_ID}";

# Add new applicants
printf "\nAdding applicants to hiring action\n";

HTTP_CODE=$(curl --write-out '%{http_code}' --silent --output /dev/null --form "applicants=@${APPLICANTS_FILE}" -H "Authorization: token ${TOKEN}" ${HOST}/api/assessment-hurdle/${HA_ID}/importUSAS);

if [ $HTTP_CODE \> 299 ]; then exit 1; fi;