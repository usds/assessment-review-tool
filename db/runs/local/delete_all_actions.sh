#!/bin/bash
. ./local_env.sh
psql ${POSTGRES} -c "DELETE FROM assessment_hurdle";