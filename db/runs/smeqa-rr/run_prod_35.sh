#/bin/bash
# Run Dec/16/2021
. ./prod_env.sh

# psql ${POSTGRES} -a -f ../../migrations/35_fix_multiple_action_metrics.sql