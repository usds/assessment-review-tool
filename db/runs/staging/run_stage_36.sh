#/bin/bash
# Run May/31/2022
. ./stage_env.sh

psql ${POSTGRES} -a -f ../../migrations/36_fix_evaluation_views_with_tie_breaker_and_exceeds.sql