import React from "react";

interface DurationProps {
  seconds: number;
}

export const Duration: React.FC<DurationProps> = ({ seconds }) => {
  return <time dateTime={`P${Math.round(seconds)}S`}>{format(seconds)}</time>;
};

function format(seconds: number) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function pad(string: Number) {
  return ("0" + string).slice(-2);
}
