import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from "@chakra-ui/core";
import React from "react";
import { Form, Formik } from "formik";
import ReactPlayer from "react-player";
import { SingletonRouter, withRouter } from "next/router";
import { InputField } from "../general/InputField";
import { PlayPauseButton } from "./PlayPauseButton";
import { VideoQueue } from "./VideoQueue";
import {
  subscribeToVideoState,
  joinRoom,
  updateStatus,
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
    url: "",
    videoUrlQueue: [],
  };

  constructor(props: VideoPlayerProps) {
    super(props);
    const queryString = '?' + props.router.asPath.split('?')[1];
    const code = new URLSearchParams(queryString).get('code');
    if (code) {
      joinRoom(parseInt(code, 10));
      subscribeToVideoState(this.handleSync);
    } else {
      // TODO: Error handling (no room code)
    }
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

  handleEnd = () => {};

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

  refPlayer = (player: ReactPlayer | null) => {
    this.player = player;
  };

  render() {
    const { playing, played, url, videoUrlQueue } = this.state;
    return (
      <>
        <Stack justify="space-between" align="stretch">
          <Formik
            initialValues={{ url: "", isQueue: false }}
            onSubmit={async (values, { setErrors }) => {
              // TODO: Error handling
              if (values.isQueue) {
                this.handleAddToQueue(values.url);
              } else {
                this.setState({ url: values.url, playing: true });
              }
            }}
          >
            {({ isSubmitting, submitForm, setFieldValue }) => (
              <Form>
                <HStack>
                  <InputField
                    name="url"
                    placeholder="url"
                    label=""
                  ></InputField>
                  <Button
                    onClick={submitForm}
                    id="play"
                    isLoading={isSubmitting}
                  >
                    Play
                  </Button>
                  <Button
                    id="queue"
                    isLoading={isSubmitting}
                    onClick={() => {
                      setFieldValue("isQueue", true);
                      submitForm();
                    }}
                  >
                    Queue
                  </Button>
                </HStack>
              </Form>
            )}
          </Formik>
          {this.state.url === "" ? (
            <Box width="100%" height="750px" borderWidth="5px">
              <Flex alignItems="center" justifyContent="center">
                <Heading mt={10}>Choose a video to play!</Heading>
              </Flex>
            </Box>
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
              onEnd={this.handleEnd}
              onProgress={this.handleProgress}
            ></ReactPlayer>
          )}
          <Slider onChange={this.handleSeekChange} value={played}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <HStack justify="center">
            <PlayPauseButton
              playing={playing}
              onClick={this.handlePlayPause}
            ></PlayPauseButton>
          </HStack>
          <VideoQueue videoQueue={videoUrlQueue}></VideoQueue>
        </Stack>
      </>
    );
  }
}

export default withRouter(VideoPlayer);
