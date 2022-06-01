import { HMSSDK } from "../src";

let sdk: HMSSDK;

beforeEach(() => {
  sdk = new HMSSDK();
});

describe("room service", () => {
  test("create and get room works", async () => {
    const roomService = sdk.getRoomService();
    // gets the prev again if already exists else create
    const room = await roomService.createRoom({ name: "test-room" });
    const roomById = await roomService.getRoomById(room.id);
    const roomByName = await roomService.getRoomByName(room.name);
    console.log(room);
    expect(room.id).toBe(roomById.id);
    expect(room.id).toBe(roomById.id);
    expect(room.name).toBe(roomById.name);
    expect(room.name).toBe(roomByName.name);
  });
});
