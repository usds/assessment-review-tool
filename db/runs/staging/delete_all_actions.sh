#!/bin/bash
. ./stage_env.sh
psql ${POSTGRES} -c "DELETE FROM assessment_hurdle";