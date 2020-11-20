import {
  Box,
  HStack,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import { findDOMNode } from "react-dom";
import { AiFillPlayCircle, AiOutlineFullscreen } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import ReactPlayer from "react-player";
import { SingletonRouter, withRouter } from "next/router";
import screenfull from "screenfull";
import { InputField } from "../general/InputField";
import { Duration } from "./Duration";
import { PlayPauseButton } from "./PlayPauseButton";
import { VideoQueue } from "./VideoQueue";
import {
  subscribeToVideoState,
  updateStatus,
  resyncVideo,
  VideoState
} from '../../api/sync/sync-client';

type VideoPlayerProps = {
  router: SingletonRouter;
};

type VideoPlayerState = {
  ignoreUpdates: boolean;
  playing: boolean;
  seeking: boolean;
  played: number;
  duration: number;
  url: string;
  videoUrlQueue: string[];
};

type progressState = {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
};

class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerState> {
  player: ReactPlayer | null = null;
  state: VideoPlayerState = {
    ignoreUpdates: true,
    playing: false,
    seeking: false,
    played: 0,
    duration: 0,
    url: "",
    videoUrlQueue: [],
  };

  constructor(props: VideoPlayerProps) {
    super(props);
    subscribeToVideoState(this.handleSync);
  }

  handleSync = ({ playing, videoPosition }: VideoState) => {
    this.setState({ ignoreUpdates: true });
    this.player?.seekTo(videoPosition / 1000);
    this.setState({ playing });
  }

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleAddToQueue = (url: string) => {
    this.setState({ videoUrlQueue: [...this.state.videoUrlQueue, url] });
  };

  handleEnd = () => {
    if (this.state.videoUrlQueue.length > 0) {
      let temp = this.state.videoUrlQueue;
      temp.shift();
      this.setState({
        url: this.state.videoUrlQueue[0],
        videoUrlQueue: temp,
        playing: true,
      });
    }
  };

  handleSeekChange = (played: number) => {
    this.setState({ played });
    this.player?.seekTo(played / 100, "fraction");
  };

  handleProgress = (state: progressState) => {
    this.setState({ played: state.played * 100 });
  };

  handleUpdate = () => {
    // TODO: switch to `const { playing, ignoreUpdates } = this.state;` after #3 is fixed
    if (this.state.ignoreUpdates) return this.setState({ ignoreUpdates: false });
    const playing = (this.player!.getInternalPlayer() as any).getPlayerState() === 1;
    const videoPosition = this.player!.getCurrentTime() * 1000;
    (window as any).player = this.player;
    updateStatus(playing, videoPosition);
  };

  handleDuration = (duration: number) => {
    this.setState({ duration });
  };

  handleFullScreen = () => {
    if (screenfull.isEnabled) {
      if (this.player !== null) {
        // Getting annoying Typescript error: Argument of type
        // 'Element | Text | null' is not assignable to parameter of type
        // 'Element | undefined'. Don't think it matters and it still compiles.
        screenfull.request(findDOMNode(this.player));
      }
    }
  };

  refPlayer = (player: ReactPlayer | null) => {
    this.player = player;
  };

  render() {
    const { playing, duration, played, url, videoUrlQueue } = this.state;
    return (
      <>
        <Stack justify="space-between" align="stretch">
          {this.state.url === "" ? (
            <Box
              width="100%"
              height="750px"
              borderWidth="2px"
              rounded="lg"
              bg="secondary"
            ></Box>
          ) : (
            <ReactPlayer
              width="100%"
              height="750px"
              ref={this.refPlayer}
              url={url}
              playing={playing}
              onPlay={this.handleUpdate}
              onPause={this.handleUpdate}
              onSeek={this.handleUpdate}
              onEnded={this.handleEnd}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
            ></ReactPlayer>
          )}
          <HStack>
            <PlayPauseButton
              playing={playing}
              onClick={this.handlePlayPause}
            ></PlayPauseButton>
            <IconButton
              // variant="outline"
              colorScheme="teal"
              isRound={true}
              aria-label="Call Sage"
              fontSize="20px"
              onClick={this.handleFullScreen}
              icon={<AiOutlineFullscreen />}
            />
            <Box />
            <Slider onChange={this.handleSeekChange} value={played}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Box />
            <Duration seconds={duration * (played / 100)} />
          </HStack>
          <VideoQueue videoQueue={videoUrlQueue}></VideoQueue>
          <Formik
            initialValues={{ url: "", isQueue: false }}
            onSubmit={async (values, { setErrors }) => {
              // TODO: Error handling
              if (values.isQueue) {
                this.handleAddToQueue(values.url);
              } else {
                this.setState({ url: values.url, playing: true });
              }
              resyncVideo();
            }}
          >
            {({ isSubmitting, submitForm, setFieldValue }) => (
              <Form>
                <HStack>
                  <IconButton
                    colorScheme="teal"
                    isRound={true}
                    aria-label="Call Sage"
                    fontSize="20px"
                    onClick={submitForm}
                    icon={<AiFillPlayCircle />}
                  />
                  <IconButton
                    id="queue"
                    colorScheme="teal"
                    isRound={true}
                    aria-label="Call Sage"
                    fontSize="20px"
                    icon={<BiAddToQueue />}
                    isLoading={isSubmitting}
                    onClick={() => {
                      setFieldValue("isQueue", true);
                      submitForm();
                    }}
                  />
                  <InputField
                    name="url"
                    placeholder="Video URL"
                    label=""
                  ></InputField>
                </HStack>
              </Form>
            )}
          </Formik>
        </Stack>
      </>
    );
  }
}

export default withRouter(VideoPlayer);
