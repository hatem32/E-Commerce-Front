export const environment = {
  production: false,
  apiUrl: 'https://localhost:7227/api',
  // The MVC Admin Dashboard is a separate app (not part of this Angular project).
  // Admins get redirected here after login instead of seeing the storefront.
  adminDashboardUrl: 'https://localhost:7062',
  // Paste your Stripe TEST publishable key here (starts with pk_test_...).
  // This is safe to expose client-side - it is NOT the secret key.
  stripePublishableKey: 'pk_test_51U8mp31rxt01I2GjJdvf7tvR4XRZtlrOX0qTCSssFK439r01D4hulGNnmt0Sw3G5xkkx2lNsk5xLJP7BTfe3shWa00JaqjuxYE'
};