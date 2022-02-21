import Cookies from 'js-cookie';

function setSessionCookie(token: string) {
  Cookies.remove('session');
  Cookies.set(
    'session',
    token,
    {
      expires: 14,
      sameSite: 'strict',
      secure: true,
    },
  );
}

function getSessionCookie() {
  const sessionCookie = Cookies.get('session');
  return (sessionCookie === undefined) ? null : sessionCookie;
}

function removeSessionCookie() {
  Cookies.remove('session');
}

export { setSessionCookie, getSessionCookie, removeSessionCookie };
