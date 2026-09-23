import axios from "axios";
import { ZoomAuthService } from "./zoomAuthService";

interface ZoomMeetingSettings {
  host_video: boolean;
  participant_video: boolean;
  join_before_host: boolean;
  mute_upon_entry: boolean;
  watermark: boolean;
  use_pmi: boolean;
  approval_type: number;
  audio: string;
  auto_recording: string;
  waiting_room: boolean;
}

interface ZoomMeetingRequest {
  topic: string;
  type: number;
  start_time: string;
  duration: number;
  timezone: string;
  settings: ZoomMeetingSettings;
}

interface ZoomMeetingResponse {
  id: string;
  join_url: string;
  start_url: string;
  password: string;
  topic: string;
  start_time: string;
  duration: number;
}

export class ZoomMeetingService {
  private static baseURL = "https://api.zoom.us/v2";

  static async createMeeting(meetingData: {
    topic: string;
    startTime: Date;
    duration: number;
    timezone?: string;
  }): Promise<ZoomMeetingResponse> {
    try {
      if (
        process.env.NODE_ENV === "development" &&
        !process.env.ZOOM_CLIENT_ID
      ) {
        console.log("🔧 Development mode: Generating simple meeting link");
        return this.generateSimpleMeetingLink(
          meetingData.topic,
          meetingData.startTime
        );
      }

      const token = await ZoomAuthService.getAccessToken();

      const requestBody: ZoomMeetingRequest = {
        topic: meetingData.topic,
        type: 2,
        start_time: meetingData.startTime.toISOString(),
        duration: meetingData.duration,
        timezone: meetingData.timezone || "UTC",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          mute_upon_entry: false,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: "both",
          auto_recording: "none",
          waiting_room: false,
        },
      };

      const response = await axios.post(
        `${this.baseURL}/users/me/meetings`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        id: response.data.id,
        join_url: response.data.join_url,
        start_url: response.data.start_url,
        password: response.data.password,
        topic: response.data.topic,
        start_time: response.data.start_time,
        duration: response.data.duration,
      };
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      return this.generateSimpleMeetingLink(
        meetingData.topic,
        meetingData.startTime
      );
    }
  }

  static async getMeeting(meetingId: string): Promise<ZoomMeetingResponse> {
    try {
      const token = await ZoomAuthService.getAccessToken();

      const response = await axios.get(
        `${this.baseURL}/meetings/${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        id: response.data.id,
        join_url: response.data.join_url,
        start_url: response.data.start_url,
        password: response.data.password,
        topic: response.data.topic,
        start_time: response.data.start_time,
        duration: response.data.duration,
      };
    } catch (error) {
      console.error("Error getting Zoom meeting:", error);
      throw new Error("Failed to get meeting details");
    }
  }

  static generateSimpleMeetingLink(
    topic: string,
    startTime: Date
  ): ZoomMeetingResponse {
    const meetingId = Math.random().toString(36).substring(2, 15);
    const password = Math.random().toString(36).substring(2, 8);

    return {
      id: meetingId,
      join_url: `https://zoom.us/j/${meetingId}?pwd=${password}`,
      start_url: `https://zoom.us/s/${meetingId}?pwd=${password}`,
      password: password,
      topic: topic,
      start_time: startTime.toISOString(),
      duration: 60,
    };
  }
}
