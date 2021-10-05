<script>
  import { onMount } from "svelte";
  import OktaSignIn from "@okta/okta-signin-widget";

  const {
    FE_OKTA_AUTH_DOMAIN,
    FE_OKTA_AUTH_TOKEN,
    FE_OKTA_CLIENT_ID,
    FE_OKTA_REDIRECT_BASE_URL,
  } = process.env;

  const clientId = FE_OKTA_CLIENT_ID;
  const issuer = `https://${FE_OKTA_AUTH_DOMAIN}/oauth2/${FE_OKTA_AUTH_TOKEN}`;
  const redirectUri = `${
    FE_OKTA_REDIRECT_BASE_URL || window.location.origin
  }/auth/redirect`;

  const config = {
    baseUrl: issuer?.split("/oauth2")[0],
    clientId,
    redirectUri,
    authParams: { issuer },
    el: "#sign-in-widget",
    features: {
      router: true,
      registration: true,
      rememberMe: true,
      idpDiscovery: true,
      showPasswordToggleOnSignInPage: true,
    },
    idpDiscovery: {
      requestContext: redirectUri,
    },
    i18n: {
      en: {
        "primaryauth.username.placeholder": "Email",
        "error.username.required": "Please enter an email",
        "password.forgot.email.or.username.placeholder": "Email",
        "password.forgot.email.or.username.tooltip": "Email",
        "registration.form.title": "Create an Account",
        "registration.form.submit": "Create Account",
        "registration.signup.text": "Visit the account creation page",
        goback: "Visit the signin page",
      },
    },
  };

  onMount(() => {
    console.log(config);
    const widget = new OktaSignIn(config);

    widget.showSignInAndRedirect().catch(console.error);

    return () => {
      widget.remove();
    };
  });
</script>

<div id="sign-in-widget"></div>
