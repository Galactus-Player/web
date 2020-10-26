import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:8000");

export interface VideoState {
  isPlaying: boolean
  videoPosition: number
}

interface StatusResponse {
  isPlaying: boolean,
  timestamp: number,
  videoPosition: number
}

interface SyncResponse {
  clientTimestamp: number
  serverTimestamp: number
}

let ntpSamples: number[] = [];
let ntpTimeoutHandler: number = -1;
let timestampOffset = 0;
let currentStatus = { isPlaying: false, timestamp: 0, videoPosition: 0 };

export function getCurrentVideoState(): VideoState {
  return calculateVideoPosition(currentStatus);
}

export function subscribeToVideoState(cb: (state: VideoState) => any) {
  socket.on("status", (status: StatusResponse) => cb(calculateVideoPosition(status)));
}

export function synchronizeClocks() {
  clearTimeout(ntpTimeoutHandler);
  ntpTimeoutHandler = setTimeout(handleSyncComplete, 6000) as any;
  const sendSyncReq = () => socket.emit("sync", { timestamp: new Date().getTime() });
  for (let i = 0; i < 8; i++) setTimeout(sendSyncReq, 100 * i);
}

export function pause(videoPosition: number) {
  callAction("pause", videoPosition);
}

export function play(videoPosition: number) {
  callAction("play", videoPosition);
}

export function seek(videoPosition: number) {
  callAction("seek", videoPosition);
}

function callAction(actionName: string, videoPosition: number) {
  const timestamp = new Date().getTime() + timestampOffset;
  socket.emit(actionName, { timestamp, videoPosition });
}

function calculateVideoPosition({ isPlaying, timestamp, videoPosition }: StatusResponse): VideoState {
  if (isPlaying) {
    const currentTimestamp = new Date().getTime();
    const currentVideoPosition = currentTimestamp + timestampOffset - timestamp + videoPosition;
    return { isPlaying, videoPosition: currentVideoPosition };
  } else {
    return { isPlaying, videoPosition };
  }
}

function handleSyncComplete() {
  clearTimeout(ntpTimeoutHandler);
  if (ntpSamples.length > 0) {
    timestampOffset = ntpSamples.sort((a, b) => Math.abs(a) - Math.abs(b))[0];
  }
  ntpSamples = [];
  if (!currentStatus.timestamp) socket.emit("status");
}

function handleSyncResponse({ clientTimestamp: sendTimestamp, serverTimestamp }: SyncResponse) {
  const recvTimestamp = new Date().getTime();
  const offset = serverTimestamp - (sendTimestamp + recvTimestamp) / 2;
  ntpSamples.push(offset);
  if (ntpSamples.length >= 8) handleSyncComplete();
}

socket.on("status", (status: StatusResponse) => currentStatus = status);
socket.on("sync", handleSyncResponse);

synchronizeClocks();
