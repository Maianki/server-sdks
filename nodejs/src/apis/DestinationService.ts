import { HLSRecordingConfig, HLSRoomState, RoomService } from "./RoomService";
import { logger } from "../LoggerService";
import { pollTillSuccess } from "../utils/timerUtils";

export class DestinationService {
  constructor(private roomService: RoomService) {}

  async startHLS(config: StartHLSConfig) {
    logger.debug("starting hls", config);
    const room = await this.roomService.createRoom({ name: config.identifier });
    await this.startHLSForRoom(room.id, config);
    logger.debug("hls started", config);
  }

  /**
   * starts HLS immediately or schedules a HLS to start in the future depending on whether scheduleAt is passed
   * in config. If it's scheduled give the eventual url
   * immediately, else wait till HLS is actually started for giving out the url.
   */
  async startHLSAndGetUrl(config: StartHLSConfig): Promise<HLSRoomState> {
    logger.debug("starting hls", config);
    const room = await this.roomService.createRoom({
      name: config.identifier,
      templateId: config.templateId,
    });
    await this.startHLSForRoom(room.id, config);
    logger.info("hls started", config);
    const getHlsState: () => Promise<HLSRoomState> = async () => {
      const state = await this.roomService.getHlsStateByRoomId(room.id);
      if (!state.url && config.scheduleAt) {
        // hls is scheduled for future, running will be false, but we can still get the url
        state.url = await this.roomService.getHlsURL(room.id);
      }
      return state;
    };
    const hlsState: HLSRoomState = await pollTillSuccess(getHlsState, (hlsState) => !hlsState.url);
    logger.info("hls started, got hls state", config, hlsState);
    return hlsState;
  }

  async getHlsState({ identifier }: { identifier: string }) {
    const room = await this.roomService.createRoom({ name: identifier });
    return this.roomService.getHlsStateByRoomId(room.id);
  }

  async stopHLS({ identifier }: { identifier: string }) {
    logger.debug("stopping hls", { identifier });
    const room = await this.roomService.getRoomByName(identifier);
    await this.roomService.stopHLS({ roomId: room.id });
    logger.info("hls stopped", { identifier });
  }

  private async startHLSForRoom(roomId: string, config: StartHLSConfig) {
    await this.roomService.startHLS({
      meetingUrl: config.appUrl,
      roomId: roomId,
      recording: config.recording,
      scheduleAt: config.scheduleAt,
    });
  }
}

export interface StartHLSConfig {
  /**
   * convert the passed in webapp url to m3u8 stream
   */
  appUrl: string;
  /**
   * identifier from your side for the hls, use this to stop hls
   */
  identifier: string;
  recording?: HLSRecordingConfig;
  /**
   * a future date to start hls at
   */
  scheduleAt?: Date;
  templateId?: string;
}
