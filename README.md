## Javascript client-side session manager

#### A client-side session manager, manage access token, user data and session time.


### Getting started
```
npm i clientside-session-manager
```

Import the module.

```javascript
import SessionManager from 'clientside-session-manager';
```

And then the session manager methods will be available.

Examples:

Creates a session that will expires in 30 minutes.
```javascript
SessionManager.create('randomaccesstoken', {name: 'Maikon', age: 23}, 30)
```

Accesses the token from the created session.
```javascript
const token = SessionManager.getToken();
```

Accesses the name attribute from the created session.
```javascript
const name = SessionManager.getDetail('name');
```

### All available methods.
```javascript
create(token, data, timeExpire) - // Creates a session.
getAll() - // Returns the full user data object.
getDetail(detailKey) - // Returns a unique information from user data.
getToken() - // Returns the access token.
exists() - // Returns whether a valid session exists.
updateToken(newToken) - // Updates the access token and when the session will expire.
updateDetail(detailKey, newValue) - // Updates a unique information in user data.
addDetail(detailKey, value) - // Add a new information in user data.
destroy(reloadPage) - // Destroys the current active session.
```
