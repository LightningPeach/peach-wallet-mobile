export const fromScreen = (fromRoute, route, params) => ({
  routeName: route,
  key: fromRoute,
  params,
});

export const isRouteActive = (routeName, navigationState) => {
  if (!navigationState) {
    return false;
  }

  const route = navigationState.routes[navigationState.index];

  if (route.routeName === routeName) {
    return true;
  } else if (route.routes) {
    return isRouteActive(routeName, route);
  }

  return false;
};
