# Schema
[Schema](../backend/db)

# Connecting to the database -- Development & Staging

Staging is done on primarily in gsa-open-ops cloud.gov space. It is a postgresql on AWS RDS.

Using the command line, you can "bind" an app with a service. The hosted backend should be "bound" with the hosted db.

### Step 1: Log in and point your target to the sandbox.

Refer to the [docs](https://cloud.gov/docs/apps/managed-services/)

### Step 2: Create a service key

You will need a service key for the backend to connect to the DB

You can check if the API call to create the db has been completed by looking at the `last operation`, which should say "create succeeded":

> cf services

Just because the `create db` command was run doesn't mean the service has finished provisioning. Try to create a key to verify:

> cf create-service-key smeqa-db smeqa-db-service-key

Note: You may need to wait a few minutes before this command works.

### Step 3: Use credentials to connect locally running backend to sandbox

1. Copy/paste the contents of `backend/template-env.js` into a new file, `backend/.env`.

2. Use the service key to get your credentials by running:

   > cf service-key smeqa-db smeqa-db-service-key

3. Copy the credentials to your newly created `.env` file

### Step 4: Set-up ssh-port forwarding

Your local backend will try to connect to the cloud.gov DB directly over port 5432. Unfortunately, direct connections to the database do not work unless you're in the same space as the DB.

To work around this, we need to setup a "host app" that uses ssh port-forwarding to communicate with the DB. Although we can create a dedicated host app for this purpose, we can use the existing `smeqa` cloud.gov app as the host.

More details are here:
https://docs.cloudfoundry.org/devguide/deploy-apps/ssh-services.html

In a separate terminal window, run the following:




```
// login
> cf login -a api.fr.cloud.gov --sso

// get the guid of the smeqa app
// this host app that tunnels our request to the db
> myapp_guid=$(cf app --guid smeqa-staging)

// define the db host and port
// this is where the host app should forward requests to.
// Call this destination `tunnel`
myapp_guid=$(cf app --guid smeqa-staging); tunnel=$(cf curl /v2/apps/$myapp_guid/env | jq -r '[.system_env_json.VCAP_SERVICES."aws-rds"[0].credentials | .host, .port] | join(":")'); cf ssh -N -L 5432:$tunnel smeqa-staging

// actually do the port forwarding
// this tells the host app to auto-forward incoming requests on port 5432 to the the db at the `tunnel` path defined above. The db is also happening to listen to port 5432
cf ssh -N -L 5432:$tunnel smeqa-staging
```

TODO: add this to a `prestart` script

# Managing the Sandbox DB

To wipe all data in the sandbox DB and repopulate it with staging data, run the following script:

> yarn reset-db

This deletes all tables, recreates them, and populates it with fake data.

TODO: create fake data to populate database

# Setting up the Sandbox Database

You should only have to do this once

Most of the setup steps below references the documentation:
https://cloud.gov/docs/services/relational-database/

### Step 1: Log in and point your target to the sandbox. Refer to the [docs](https://cloud.gov/docs/apps/managed-services/)

### Step 2: Create the DB service in the sandbox space

> cf create-service aws-rds shared-psql smeqa-sandbox-db -c '{"storage": 1}'

We're only specifying 1GB of space since we don't need a lot for the sandbox version. This can change in production, but should be small nonetheless

For production, there is a different aws-rds plan to specify. See the [list of plans](https://cloud.gov/docs/services/relational-database/) for options and configuration parameters

### Step 3: Connect the hosted backend to the sandbox db

#### Step 3a. (optional) Manually bind the backend with the db

The backend app would need credentials to read/write to the DB service. Passing credentials "binds" and app with a service. There are two ways of binding the app:

> cf bind-service smeqa-backend smeqa-db

Note: At this point, your target should be the sandbox space, though this same command would work in the production space

#### Step 3b. Update the manifest.yml for automatic binding during deploys

Instead of 3a, you an add the db service in the backend's `manifest.yml` to automatically bind the service whenever you push the backend.

```
...
services:
 - smeqa-db
```

Binding a service creates a `DATABASE_URL` environment variable for the backend app, which contains the the credentials to connect to the db.

#### Step 3c. (optional) Verify the backend and db have been connected via ssh

There are a few ways, but the easiest is to use this tool:
https://github.com/18F/cf-service-connect#readme

> cf connect-to-service smeqa smeqa-db

### Step 4: Setup your locally running backend to connect to the sandbox

You will need a service key for the backend to connect to the DB

You can check if the API call to create the db has been completed by looking at the `last operation`, which should say "create succeeded":

> cf services

Just because the `create db` command was run doesn't mean the service has finished provisioning. Try to create a key to verify:

> cf create-service-key smeqa-db smeqa-db-service-key

Note: You may need to wait a few minutes before this command works.

After the key is created, you need to get your credentials from it:

> cf service-key smeqa-db smeqa-db-service-key

### Step 5: Use credentials to connect locally running backend to sandbox

Copy the credentials created above to your environment variables file at `backend/.env`

### Step 6: Set-up ssh-port forwarding

Your local backend will try to connect to the cloud.gov db directly over port 5432. Unfortunately, direct connections to the database do not work unless you're in the same space as the DB.

To work around this, we need to setup a "host app" that uses ssh port-forwarding to communicate with the db. Although we can create a dedicated host app for this purpose, we can use the existing `smeqa` cloud.gov app as the host.

More details are here:
https://docs.cloudfoundry.org/devguide/deploy-apps/ssh-services.html

```
// get the guid of the smeqa app
// this host app that tunnels our request to the db
> myapp_guid=$(cf app --guid smeqa)

// define the db host and port
// this is where the host app should forward requests to.
// Call this destination `tunnel`
tunnel=$(cf curl /v2/apps/$myapp_guid/env | jq -r '[.system_env_json.VCAP_SERVICES."aws-rds"[0].credentials | .host, .port] | join(":")')

// actually do the port forwarding
// this tells the host app to auto-forward incoming requests on port 5432 to the the db at the `tunnel` path defined above. The db is also happening to listen to port 5432
cf ssh -N -L 5432:$tunnel smeqa
```
