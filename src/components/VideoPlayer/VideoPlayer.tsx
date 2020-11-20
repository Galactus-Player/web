import {
  Box,
  HStack,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  VStack
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

import { QueueApi, AddVideoRequest, DefaultApi, Video } from '../../api/queue';

type VideoPlayerProps = {
  room: string;
  router: SingletonRouter;
};

type VideoPlayerState = {
  ignoreUpdates: boolean;
  playing: boolean;
  seeking: boolean;
  played: number;
  videoUrlQueue: Video[];
  queueUpdateCounter: number;
  qUpdateInterval?: NodeJS.Timeout | null;
  duration: number;
  // url: string;
  // videoUrlQueue: string[];
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
    // url: "",
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

  handleEnd = () => {
    if (this.state.videoUrlQueue.length > 0) {
      let temp = this.state.videoUrlQueue;
      temp.shift();
      // TODO: Play 2nd video.
      this.setState({
        // url: this.state.videoUrlQueue[0],
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
        /* @ts-ignore */
        screenfull.request(findDOMNode(this.player));
      }
    }
  };

  refPlayer = (player: ReactPlayer | null) => {
    this.player = player;
  };

  render() {
    const { playing, played, videoUrlQueue, duration } = this.state;
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
                if (values.isQueue) {
                  await this.handleAddToQueue(this.props.room, values.url);
                } else {
                  await this.handleAddToQueue(this.props.room, values.url, true);
                  this.setState({ playing: true });
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
          </Box>
          <HStack w="100%" alignItems="start" justifyContent="space-evenly" bg="green.100">
            <VStack w="70%" bg="pink.100">
              {currentVideo === null ? (
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
                  url={currentVideo.url}
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

export default withRouter(VideoPlayer);
