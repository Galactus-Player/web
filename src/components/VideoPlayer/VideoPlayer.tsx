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
import { InputField } from "../general/InputField";
import { PlayPauseButton } from "./PlayPauseButton";
import { VideoQueue } from "./VideoQueue";

type VideoPlayerProps = {};

type VideoPlayerState = {
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
    playing: false,
    seeking: false,
    played: 0,
    url: "",
    videoUrlQueue: [],
  };

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

  // TODO(issue) connect all callbacks to the sync service.
  handlePlay = () => {};

  handlePause = () => {};

  handleSeek = () => {};

  refPlayer = (player: ReactPlayer | null) => {
    this.player = player;
  };

  render() {
    const { playing, seeking, played, url, videoUrlQueue } = this.state;
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
              onPlay={this.handlePlay}
              onPause={this.handlePause}
              onSeek={this.handleSeek}
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

export default VideoPlayer;