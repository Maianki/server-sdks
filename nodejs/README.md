## 100ms NodeJs Server Side SDK

## Note

This is early alpha, APIs can break/change at any time.

## Documentation

The `examples/nodejs` folder on root has some examples.


## Docs

### Env Variables to configure
- `HMS_ACCES_KEY` => access key as present in dashboard's developer section
- `HMS_SECRET` => app secret as present in dashboard's developer section

### Create SDK Instance

```js
const sdk = new HMSSDK();
```

### Generating management token

```js
console.log(await sdk.getManagementToken());
```

### Generating app token

```js
console.log(await sdk.getAppToken({roomId, role, userId}));
```

### Creating and Updating room

You can pass in an existing room name to get the room object for previously created room.

```js
const roomService = sdk.getRoomService();
const room = await roomService.createRoom({name, description, templateId, region});
console.log(room);
```

### Start HLS

```js
const roomService = sdk.getRoomService();
await roomService.startHLS({roomId, meetingUrl, recording: {hlsVod, singleFilePerLayer}});
```

### Start HLS For a room from Meeting URL

The HLS m3u8 url will be received in webhook response.
If room id is not passed, new room will be created. Recording is optional.

```js
const roomService = sdk.getRoomService();
const hlsUrl = await roomService.startHLS({roomId, meetingUrl, recording: {hlsVod, singleFilePerLayer}});
```

### Start HLS from meeting url

Pass in an url and get a m3u8 back which is obtained by converting that meeting URl to a HLS Stream.
This might take significant time.

```js
const transportService = sdk.getTransportService();
const hlsUrl = await transportService.startHLSSync({identifier, meetingUrl});
await transportService.stopHLS();
```

roomId and recording can be optionally passed.

## Planned

- Use https://github.com/typestack/class-transformer for converting between api response and Room Object etc.