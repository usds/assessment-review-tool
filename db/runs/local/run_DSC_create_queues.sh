#!/bin/bash
. ./local_env.sh
psql ${POSTGRES} -a -f ../../../assessmentHurdleExamples/prod/DSC_written/cyber/userAssignments.sql
psql ${POSTGRES} -a -f ../../../assessmentHurdleExamples/prod/DSC_written/data/userAssignments.sql
psql ${POSTGRES} -a -f ../../../assessmentHurdleExamples/prod/DSC_written/product/userAssignments.sql
psql ${POSTGRES} -a -f ../../../assessmentHurdleExamples/prod/DSC_written/swe/userAssignments.sql
psql ${POSTGRES} -a -f ../../../assessmentHurdleExamples/prod/DSC_written/design/userAssignments.sql
