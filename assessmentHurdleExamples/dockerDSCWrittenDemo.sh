#!/bin/bash
export HOST=localhost:9000
export TOKEN=admin

export AGENCY_DIR="./written_test"
/bin/bash ./util/hiringAction.sh
/bin/bash ./util/hiringActionDocker.sh


# export AGENCY_DIR="./prod/DSC_written/design"
# /bin/bash ./util/hiringActionDocker.sh

# export AGENCY_DIR="./prod/DSC_written/data"
# /bin/bash ./util/hiringActionDocker.sh

# export AGENCY_DIR="./prod/DSC_written/swe"
# /bin/bash ./util/hiringActionDocker.sh

# export AGENCY_DIR="./prod/DSC_written/product"
# /bin/bash ./util/hiringActionDocker.sh

# export AGENCY_DIR="./prod/DSC_written/cyber"
# /bin/bash ./util/hiringActionDocker.sh
