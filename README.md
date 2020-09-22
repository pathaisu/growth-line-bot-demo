# LINE Bot

### API

POST: `/callback` : Core API which links to LINE OA webhook.
- Handle new follower
- Handle a follower who follows again
- Echo message for existing follower (only for text type)

```js
// Request and Response of API will be handled by LINE SKD middleware
const middleware = line.middleware(config);
```

POST: `/push` : API to push message to a single follower.

```js
// Request body
{
  'to': 'Uaeef12de300b2ee0834ddd51981fa5ea',
  'text': 'Hi Hi K.{Nickname} from Lucky and Mautic',
}
```

POST: `/targeted` : API to push message to all followers who have `{ shouldSend : true }` (from google-sheet)

```js
// Request body
{
  'text': 'Hi Hi K.{Nickname} from Lucky and Mautic',
}
```

GET: `/follwer` : Get information of all followers
```js
// Response
[
  ...
  {
      "userId": "Uda7ed28e0855709362e1ae14419c7e08",
      "displayName": "LookPla Chonthicha💯",
      "pictureUrl": "https://profile.line-scdn.net/0hQ-ZACKh2DgJnOCFfrXBxVVt9AG8QFghKH1ZFZ0M_UDMYDR5QW15EbBU_VzdLXUhQUg4UbRU4VGJP",
      "statusMessage": "994426456",
      "language": "th",
      "shouldSend": "FALSE"
  },
  ...
]
```