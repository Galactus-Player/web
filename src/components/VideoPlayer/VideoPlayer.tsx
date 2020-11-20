import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  VStack,
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

import { QueueApi, AddVideoRequest, DefaultApi, Video } from '../../api/queue';

type VideoPlayerProps = {
  room: string;
};

type VideoPlayerState = {
  playing: boolean;
  seeking: boolean;
  played: number;
  videoUrlQueue: Video[];
  queueUpdateCounter: number;
  qUpdateInterval?: NodeJS.Timeout | null;
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
    videoUrlQueue: [],
    queueUpdateCounter: 0,
    qUpdateInterval: null
  };

  componentDidMount() {
    const qUpdateInterval = setInterval(async () => await this.updateQueue(), 3 * 1000);
    this.setState({ qUpdateInterval });
  }

  componentWillUnmount() {
    if (this.state.qUpdateInterval) {
      clearInterval(this.state.qUpdateInterval);
    }
  }

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  getCurVid = (): Video | null => {
    return this.state.videoUrlQueue.length > 0 ? this.state.videoUrlQueue[0] : null;
  }

  updateQueue = async () => {
    const queueApi = new DefaultApi();
    const videoQueueObj = await queueApi.getQueue({ code: this.props.room });

    console.log(`updateQueue: ${JSON.stringify(videoQueueObj)}`);

    if (videoQueueObj.counter !== this.state.queueUpdateCounter && videoQueueObj.queue) {
      this.setState({ videoUrlQueue: videoQueueObj.queue! })
    }
  }

  handleAddToQueue = async (roomCode: string, url: string, startPlayin: boolean = false) => {
    const queueApi = new QueueApi();
    const video = await queueApi.addVideo({ code: roomCode, addVideoRequest: { url } })
    console.log(JSON.stringify(video));
    if (!video.url || !video.id) {
      // TODO: Handle Error
      return;
    }
    if (startPlayin) {
      this.handlePlayFromQueue(this.props.room, video.id);
    } else {
      this.setState({ videoUrlQueue: [...this.state.videoUrlQueue, video] });
    }
  };

  handleRemoveFromQueue = async (roomCode: string, videoId: string) => {
    const queueApi = new QueueApi();
    try {
      const resp = await queueApi.removeVideo({ code: roomCode, removeVideo: { id: videoId } })
      console.log(JSON.stringify(resp));
      this.setState({ videoUrlQueue: this.state.videoUrlQueue.filter(v => v.id !== videoId) });
    } catch (e) {
      console.log(`Error removing video ${e}`)
    }
  };

  handlePlayFromQueue = async (roomCode: string, videoId: string) => {
    const queueApi = new QueueApi();
    try {
      const resp = await queueApi.playVideo({ code: roomCode, playVideo: { id: videoId } })
      console.log(`handlePlayFromQueue: ${JSON.stringify(resp)}`);
      if (resp.queue && resp.queue.length > 0) {
        this.setState({ videoUrlQueue: resp.queue });
      }
    } catch (e) {
      console.log(`Error removing video ${e}`)
    }
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
    const { playing, played, videoUrlQueue } = this.state;
    const currentVideo = this.getCurVid();
    console.log(`Video Player: ${JSON.stringify(currentVideo)}`);
    return (
      <>
        <VStack justify="space-between" align="stretch" bg="yellow.100" alignItems="center">
          <Box w="50%">
            <Formik
              initialValues={{ url: "", isQueue: false }}
              onSubmit={async (values, { setErrors }) => {
                // TODO: Error handling
                await this.handleAddToQueue(this.props.room, values.url, true);
                this.setState({ playing: true });
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
          </Box>
          <HStack w="100%" alignItems="start" justifyContent="space-evenly" bg="green.100">
            <VStack w="70%" bg="pink.100">
              {currentVideo === null ? (
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
                  url={currentVideo.url!}
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
            </VStack>
            <VideoQueue
              videoQueue={videoUrlQueue} 
              removeVideo={async (videoId) => await this.handleRemoveFromQueue(this.props.room, videoId)}
              playVideo={async (videoId) => await this.handlePlayFromQueue(this.props.room, videoId)}
            ></VideoQueue>
          </HStack>
        </VStack>
      </>
    );
  }
}

export default VideoPlayer;
