import { HMSSDK } from "@100mslive/server-sdk";

const accessKey = process.env.HMS_ACCESS_KEY;
const secret = process.env.HMS_SECRET;

// initialise sdk
const sdk = new HMSSDK(accessKey, secret);
const destinationService = sdk.getDestinationService();

// start hls and get m3u8 url back
const hlsIdentifier = "referenceId"; // use this to call stop
const appUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const scheduleAt = AddMinutesToDate(new Date(), 1) // Schedule HLS after 1 minute
const templateId = "62f4be258f075bdc16323ea4"
try {
  const { url: urlWithStart } = await destinationService.startHLSAndGetUrl({
    identifier: hlsIdentifier,
    appUrl,
    scheduleAt,
    templateId
  });
  console.log(
    `started hls for appUrl - ${appUrl} at hls url - ${urlWithStart}`
  );

  const { url: urlLater } = await destinationService.getHlsState({
    identifier: hlsIdentifier,
  });
  console.log("hls url retrieved later", urlLater);
} catch (err) {
  console.error("failed to start hls and get url ", err);
}

await destinationService.stopHLS({ identifier: hlsIdentifier });


function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}