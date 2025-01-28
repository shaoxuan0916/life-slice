const config = {
  // REQUIRED
  appName: "LifeSlice",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription: "Record your life.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "lifeslice.pro",
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/login",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/journeys",
  },
} as ConfigProps;

export default config;
