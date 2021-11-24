# How to Contribute

- Bugs? create an issue

## Testing

We currently need to update and fix a lot of our tests; this would be a great
place to scrub in.

## Submitting Changes

Send in a PR to the stage branch with a clear list of feature changes. Smaller
PRs are more likely to be accepted.

## Conventions

- We use npm
- At some point we'll use prettier and eslint

### Frontend (React/redux-toolkit):

We use the presentation and container pattern on the frontend, and currently have things split up by feature slices.

For any major feature, you can expect to create:

```
<feature>
  - <feature>.jsx           # The presentation component
  - index.jsx               # The container component
# Optional depending on the feature:
  - <feature>Requests.js    # network requests
  - <feature>Slice.js       # redux state management
```

For minor utility components we don't always break things up.

Current styles are a smorgashboard of USWDS and a bit of our own - this needs a lot of cleaning up.

### API (TS, express, sequelize):

On the backend the main thread to follow if you make any database changes are:

1. src/models # These are where the interface to the db is
2. src/services # The services will call on the models for any necessary business logic
3. src/dto # These are the shape of the objects the service will usually return to the handlers
4. src/handlers # The handlers are pretty "dumb" and just handle the request and response
5. src/routes

### Database (postgresql):

Migration files should be write only. We need to add in version tracking, but these run sequentially.
