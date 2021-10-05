## Okta Widget Reproduction Repo

This repository reproduces an issue with `okta-signin-widget` not prefilling email address
when features `router` and `idpDiscovery` are both enabled.

## Setting up

```
$ npm install
$ cp env.example .env
```

To have a working Okta widget, we need to provide some environment variables that correspond with your Okta account.

- `FE_OKTA_AUTH_DOMAIN` - Okta domain, example: `auth.oktapreview.com`
- `FE_OKTA_REDIRECT_BASE_URL` - not used for this exercise but still needed, example: `http://localhost:5000`
- `FE_OKTA_AUTH_TOKEN` - auth token used in creating the authentication URL, example: `https://${FE_OKTA_AUTH_DOMAIN}/oauth2/${FE_OKTA_AUTH_TOKEN}`
- `FE_OKTA_CLIENT_ID` - the Okta client ID, this can be retrieved via the Okta admin panel

## Running

To start in dev mode:

```
$ npm run dev
```

Or create a production build and serve from that:

```
$ npm run build
$ npm run serve
```

## Reproducing the issue

The issue that this repo has been created for is to show that when `router` and `idpDiscovery` are both enabled, the email field
does not get pre-filled correctly after submitting the form and being redirected to `/signin`.

- start the webserver
- visit `http://localhost:5000`
- type in an email address that belongs to a user in the Okta account but does not have an IDP rule associated with it and submit
- verify you get redirected to `/signin` **without** an email address pre-filled or input disabled

Contrast this behavior against disabling `router` and re-running the reproduction steps. What you'll see with `router: false`
is that after typing in the email and submitting, you see the email/password fields with email prefilled with what you
typed in the previous screen and the input is disabled.
