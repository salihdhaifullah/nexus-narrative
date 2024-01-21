/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [/^react-icons/],
  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("api/auth/logout", "api/auth/logout.ts");
      route("api/build", "api/build.ts");
      route("/", "pages/index.tsx");
      route(":blog", "pages/blog/index.tsx");
      route("auth/login", "pages/auth/login.tsx");
      route("auth/account-verification", "pages/auth/account-verification.tsx");
      route("auth/forgat-password", "pages/auth/forgat-password.tsx");
      route("auth/reset-password", "pages/auth/reset-password.tsx");
      route("auth/sing-up", "pages/auth/sing-up.tsx");
    });
  },
};
