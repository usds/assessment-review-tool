#!/bin/bash
. ./local_env.sh
echo ${POSTGRES}
psql ${POSTGRES} -a -f ./migrations/01_drop_table.sql
psql ${POSTGRES} -a -f ./migrations/02_create_extensions.sql
psql ${POSTGRES} -a -f ./migrations/03_add_update_trigger.sql
psql ${POSTGRES} -a -f ./migrations/04_add_session_table.sql
psql ${POSTGRES} -a -f ./migrations/10_create_sme_qa.sql
psql ${POSTGRES} -a -f ./migrations/11_views.sql
psql ${POSTGRES} -a -f ./migrations/12_functions.sql
psql ${POSTGRES} -a -f ./migrations/20_fix_view.sql
psql ${POSTGRES} -a -f ./migrations/21_fix_varchars.sql
psql ${POSTGRES} -a -f ./migrations/22_views.sql
psql ${POSTGRES} -a -f ./migrations/23_fix_view.sql
psql ${POSTGRES} -a -f ./migrations/30_update_audit_log.sql
psql ${POSTGRES} -a -f ./migrations/31_fix_eval_metric_view.sql
psql ${POSTGRES} -a -f ./migrations/32_update_speciality_for_exceeds.sql
psql ${POSTGRES} -a -f ./migrations/33_update_views_for_exceeds.sql
psql ${POSTGRES} -a -f ./migrations/34_update_competency_with_justifications.sql
psql ${POSTGRES} -a -f ./migrations/35_fix_multiple_action_metrics.sql
psql ${POSTGRES} -a -f ./migrations/36_fix_evaluation_views_with_tie_breaker_and_exceeds.sql
