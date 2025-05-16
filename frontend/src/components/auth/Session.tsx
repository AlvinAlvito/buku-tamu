export const isSessionExpired = (maxAgeInMs = 3600000): boolean => {
  const loginTime = localStorage.getItem("loginTime");
  if (!loginTime) return true;

  const now = new Date().getTime();
  const diff = now - parseInt(loginTime, 10);
  return diff > maxAgeInMs; 
};
