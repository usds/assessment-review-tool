export const requestCurrentUser = async () => {
  const response = await fetch("/login/check");
  const body = await response.json();
  const { status } = response;
  switch (status) {
    case 403:
      return null;
    case 200:
      return body && body.data && body.data.email && { email: body.data.email };
    default:
      new Error("There was an issue connecting to the server");
  }
};

export const logoutCurrentUser = async () => {
  await fetch("/logout");
  return true;
};

export const getCurrentVersion = async () => {
  const res = await fetch("/serverInfo");
  const body = await res.json();
  return body.buildVersion;
};
