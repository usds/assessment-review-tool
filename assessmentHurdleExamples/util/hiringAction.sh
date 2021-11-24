#!/bin/bash
# Called from parent of `util`
# expects the following env vars to be set:

: "${HOST?Need to set HOST}";
: "${TOKEN?Need to set TOKEN}";
: "${AGENCY_DIR?Need to set AGENCY_DIR}";

printf "HOST: $HOST\nTOKEN: $TOKEN\nAGENCY_DIR: $AGENCY_DIR\n";

# This creates the actual hiring action
HA_ID=`curl --silent -X PUT -H "Authorization: token ${TOKEN}" -H "Content-Type: application/json" -d @${AGENCY_DIR}/assessmentHurdle.json ${HOST}/api/assessment-hurdle/ | jq '.data.id'`;

if [[ $HA_ID == null ]]; 

then 
    printf "\nNo hiring action ID";
    exit 1; 
fi;
# Remove leading `"` 
HA_ID="${HA_ID%\"}" 
# Remove trailing `"``
export HA_ID="${HA_ID#\"}"

: "${HA_ID?Need to set HA_ID}"
printf "\nHA ID: ${HA_ID}\n";

printf "$AGENCY_DIR : $HA_ID\n" >> last_run_ha_id.txt

export APPLICANTS_FILE=${AGENCY_DIR}/applicants.csv
export USERS_FILE=${AGENCY_DIR}/users.json

# Assumes being called from the parent directory.
# These can all be called independently
# with the correct env vars.
/bin/bash ./util/addUsers.sh && \
/bin/bash ./util/addSpecialties.sh && \
/bin/bash ./util/addApplicants.sh && \
printf "\n\nHiring action successfully created!" && exit;
printf "\n\nHiring action creation failed";