#/bin/bash
# Run Dec/16/2021
. ./prod_env.sh

# psql ${POSTGRES} -a -f ../../migrations/32_update_speciality_for_exceeds.sql
# psql ${POSTGRES} -a -f ../../migrations/33_update_views_for_exceeds.sql
# psql ${POSTGRES} -a -f ../../migrations/34_update_competency_with_justifications.sql