# sous react native app
---

# Tests

## execute test

1. Change the apiConfig.js to point to the environment you want to test

2. Change the `src/__tests__/mocha-tests.js` to point to the correct settings file

3. Execute test:

      `npm test`


# Authentication Subscriptions

## 1. Phone number gets a `userId`

```
if(session.userId !== null){
  dispatch(processSubscription(DDP.SUBSCRIBE_LIST.RESTRICTED, [session.userId]))
  dispatch(processSubscription(DDP.SUBSCRIBE_LIST.ERRORS, [session.userId]))
  dispatch(processSubscription(DDP.SUBSCRIBE_LIST.SETTINGS, [session.userId]))
  dispatch(processSubscription(DDP.SUBSCRIBE_LIST.TEAMS, [session.userId]))
}
```

## 2. Phone number + the correct sms code sets `isAuthenticated` to `true`

```
const deprecate = true
const onlyNew = true
dispatch(processSubscription(DDP.SUBSCRIBE_LIST.PURVEYORS, [session.userId, teamIds]))
dispatch(processSubscription(DDP.SUBSCRIBE_LIST.CATEGORIES, [session.userId, teamIds]))
dispatch(processSubscription(DDP.SUBSCRIBE_LIST.PRODUCTS, [session.userId, teamIds, onlyNew]))
dispatch(processSubscription(DDP.SUBSCRIBE_LIST.CART_ITEMS, [session.userId, teamIds, deprecate, onlyNew]))
dispatch(processSubscription(DDP.SUBSCRIBE_LIST.ORDERS, [session.userId, teamIds, onlyNew]))
```
