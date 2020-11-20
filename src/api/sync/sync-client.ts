import SocketIO from "socket.io-client";
const socket = SocketIO();

export interface VideoState {
  playing: boolean
  videoPosition: number
}

interface StatusResponse {
  playing: boolean,
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
let currentStatus = { playing: false, timestamp: 0, videoPosition: 0 };

export function joinRoom(code: number) {
  socket.emit("join", { room: code });
}

export function resyncVideo() {
  socket.emit("status");
}

export function getCurrentVideoState(): VideoState {
  return calculateVideoPosition(currentStatus);
}

export function subscribeToVideoState(cb: (state: VideoState) => any) {
  socket.on("status", (status: StatusResponse) => cb(calculateVideoPosition(status)));
}

export function synchronizeClocks() {
  clearTimeout(ntpTimeoutHandler);
  ntpTimeoutHandler = setTimeout(handleSyncComplete, 6000) as any;
  const sendSyncReq = () => socket.emit("sync", { timestamp: getLocalTimestamp() });
  for (let i = 0; i < 8; i++) setTimeout(sendSyncReq, 100 * i);
}

export function updateStatus(playing: boolean, videoPosition: number) {
  const timestamp = getLocalTimestamp() + timestampOffset;
  socket.emit("update", { playing, videoPosition, timestamp });
}

export function calculateVideoPosition(status: StatusResponse): VideoState {
  const { playing, timestamp, videoPosition } = status;
  const currentServerTimestamp = getLocalTimestamp() + timestampOffset
  if (playing) {
    const currentVideoPosition = currentServerTimestamp - timestamp + videoPosition;
    return { playing, videoPosition: currentVideoPosition };
  } else {
    return { playing, videoPosition };
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

function handleSyncResponse(timestamps: SyncResponse) {
  const { clientTimestamp: sendTimestamp, serverTimestamp } = timestamps;
  const offset = serverTimestamp - (sendTimestamp + getLocalTimestamp()) / 2;
  ntpSamples.push(offset);
  if (ntpSamples.length >= 8) handleSyncComplete();
}

function getLocalTimestamp(): number {
  return new Date().getTime();
}

socket.on("status", (status: StatusResponse) => currentStatus = status);
socket.on("sync", handleSyncResponse);

synchronizeClocks();
