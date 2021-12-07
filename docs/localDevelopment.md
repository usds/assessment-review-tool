# Local Development:

- docker

### Useful tools

- [React Dev Tools Chrome Extension](https://github.com/facebook/react)
- [Redux Dev Tools Chrome Extension](https://github.com/reduxjs/redux-devtools)

## Running Application

### Local Development

```sh
docker compose up # this will start postgres, a frontend react server, and the backend API server
(cd ./api/agencyInfo/ && ./localHiringAction.sh) # this will populate your database wtih the basic demo application.
```

Testing:

```sh
docker compose run --rm api npm run test
```

Clean up:

```sh
# This will remove _all_ volumes and containers
docker volume rm $(docker volume ls -q) # Removes local docker volumes
docker rm -f $(docker ps -aq) # Removes local docker containers
```
