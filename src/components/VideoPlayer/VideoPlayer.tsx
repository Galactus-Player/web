import {
  Box,
  Flex,
  Heading,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/core";
import { SingletonRouter, withRouter } from "next/router";
import React from "react";
import { findDOMNode } from "react-dom";
import { BsVolumeUpFill } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { RiDoorOpenLine, RiFullscreenExitLine } from "react-icons/ri";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { DefaultApi, QueueApi, Video } from "../../api/queue";
import {
  resyncVideo,
  subscribeToVideoState,
  updateStatus,
  VideoState,
} from "../../api/sync/sync-client";
import { Button as CustomButton } from "./buttons/Button";
import { Play } from "./buttons/Play";
import { Duration } from "./Duration";
import { VideoQueue } from "./VideoQueue";

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
    videoUrlQueue: [],
    queueUpdateCounter: 0,
    qUpdateInterval: null,
  };

  componentDidMount() {
    const qUpdateInterval = setInterval(
      async () => await this.updateQueue(),
      3 * 1000
    );
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

  debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout | null = null;
    return () => {
      clearTimeout(timeout!);
      timeout = setTimeout(() => {
        timeout = null;
        func();
      }, wait);
    };
  };

  allowUpdatesAfterOneSecond = this.debounce(() => {
    this.setState({ ignoreUpdates: false });
  }, 2000);

  handleSync = ({ playing, videoPosition }: VideoState) => {
    console.log(">> RECV SYNC", { playing, videoPosition });
    this.setState({ ignoreUpdates: true });
    this.allowUpdatesAfterOneSecond();
    const internalPlayer: any = this.player?.getInternalPlayer();
    if (typeof internalPlayer?.playVideo === "function") {
      this.player!.seekTo(videoPosition / 1000);
      if (playing) internalPlayer?.playVideo();
      else internalPlayer?.pauseVideo();
    } else {
      setTimeout(resyncVideo, 2000);
    }
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
    this.handleUpdate();
  };

  getCurVid = (): Video | null => {
    return this.state.videoUrlQueue.length > 0
      ? this.state.videoUrlQueue[0]
      : null;
  };

  updateQueue = async () => {
    const queueApi = new DefaultApi();
    const videoQueueObj = await queueApi.getQueue({ code: this.props.room });

    if (videoQueueObj.counter !== this.state.queueUpdateCounter) {
      if (videoQueueObj.queue) {
        this.setState({ videoUrlQueue: videoQueueObj.queue });
      } else {
        this.setState({ videoUrlQueue: [] });
      }
    }
  };

  handleAddToQueue = async (
    roomCode: string,
    url: string,
    startPlaying: boolean = false
  ) => {
    const queueApi = new QueueApi();
    const video = await queueApi.addVideo({
      code: roomCode,
      addVideoRequest: { url },
    });
    if (!video.url || !video.id) {
      // TODO: Handle Error
      return;
    }
    if (startPlaying) {
      this.handlePlayFromQueue(this.props.room, video.id);
    } else {
      this.setState({ videoUrlQueue: [...this.state.videoUrlQueue, video] });
    }
  };

  handleRemoveFromQueue = async (roomCode: string, videoId: string) => {
    const queueApi = new QueueApi();
    try {
      const resp = await queueApi.removeVideo({
        code: roomCode,
        removeVideo: { id: videoId },
      });
      this.setState({
        videoUrlQueue: this.state.videoUrlQueue.filter((v) => v.id !== videoId),
      });
    } catch (e) {}
  };

  handlePlayFromQueue = async (roomCode: string, videoId: string) => {
    const queueApi = new QueueApi();
    try {
      const resp = await queueApi.playVideo({
        code: roomCode,
        playVideo: { id: videoId },
      });
      if (resp.queue && resp.queue.length > 0) {
        this.setState({ videoUrlQueue: resp.queue });
      }
    } catch (e) {}
  };

  handleEnd = async () => {
    const currVideo = this.getCurVid();
    if (currVideo) {
      this.handleRemoveFromQueue(
        this.props.room,
        currVideo.id ? currVideo.id : ""
      );
    }
  };

  handleSeekChange = (played: number) => {
    this.setState({ played });
    this.player?.seekTo(played / 100, "fraction");
    this.handleUpdate();
  };

  handleProgress = (state: progressState) => {
    this.setState({ played: state.played * 100 });
  };

  handleUpdate = this.debounce(() => {
    const { ignoreUpdates, played } = this.state;
    if (ignoreUpdates || !this.player) return;
    const internalPlayer: any = this.player!.getInternalPlayer();
    if (!internalPlayer) return;
    const playerState = internalPlayer.getPlayerState();
    const playing = playerState === 1 || playerState === 3;
    const videoPosition = played * internalPlayer.getDuration() * 10;
    this.setState({ playing });
    updateStatus(playing, videoPosition);
    console.log(">> SEND", { playing, videoPosition });
  }, 500);

  handleDuration = (duration: number) => {
    this.setState({ duration });
  };

  handleFullScreen = () => {
    if (screenfull.isEnabled && this.player !== null) {
      screenfull.request(findDOMNode(this.player) as Element);
    }
  };

  formOnSubmit = async (values: { url: string; isQueue: boolean }) => {
    // TODO: Error handling
    if (values.isQueue) {
      await this.handleAddToQueue(this.props.room, values.url);
    } else {
      await this.handleAddToQueue(this.props.room, values.url, true);
      this.setState({ playing: false });
    }
    resyncVideo();
  };

  refPlayer = (player: ReactPlayer | null) => {
    this.player = player;
  };

  onClickRoomCopy = async () => {
    const link = `https://galactus.live/room?code=${this.props.room}`
    await navigator.clipboard.writeText(link);
  }

  render() {
    const { playing, played, videoUrlQueue, duration } = this.state;
    const currentVideo = this.getCurVid();
    const { room } = this.props;
    return (
      <>
        <Flex bg="black">
          <Flex
            position="absolute"
            color="white"
            paddingLeft="70px"
            paddingTop="40px"
          ></Flex>
          <Flex
            position="absolute"
            paddingBottom="40px"
            bottom="0px"
            width="100%"
            flexDirection="column"
            bg="linear-gradient(
            to top,
            black,
            transparent
            );"
            paddingLeft="70px"
            paddingRight="70px"
          >
            <Flex
              justifyContent="space-between"
              alignItems="center"
              color="white"
              mb={5}
            >
              <Box />
              <Flex alignItems="center">
                <RiDoorOpenLine size="70px" color="white" />
                <Box mr={2} />
                <Heading>{room}</Heading>
                <Box mr={2} />
                <IconButton
                  size="md"
                  icon={<FiCopy />}
                  variant="outline"
                  rounded="full"
                  onClick={this.onClickRoomCopy}
                />
              </Flex>
            </Flex>
            <Flex mb="10px">
              <Slider
                defaultValue={0}
                onChange={this.handleSeekChange}
                value={played}
                colorScheme="pink"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Flex alignItems="center" color="white">
                <Box />
                <Play playing={playing} onClick={this.handlePlayPause} />
                <Box ml="35px" />
                <CustomButton ButtonType={BsVolumeUpFill} />
                <Box ml="35px" />
                <Heading>
                  <Duration seconds={duration * (played / 100)} />
                  {" / "}
                  <Duration seconds={duration} />
                </Heading>
                <Box ml="35px" />
              </Flex>
              <Flex alignItems="center" color="white">
                <Heading>
                  <Duration seconds={duration - duration * (played / 100)} />
                  {" Left"}
                </Heading>
                <Box ml="35px" />
                <VideoQueue
                  videoQueue={videoUrlQueue}
                  removeVideo={async (videoId) =>
                    await this.handleRemoveFromQueue(this.props.room, videoId)
                  }
                  playVideo={async (videoId) =>
                    await this.handlePlayFromQueue(this.props.room, videoId)
                  }
                  formOnSubmit={this.formOnSubmit}
                />
                <Box ml="35px" />
                <CustomButton
                  ButtonType={RiFullscreenExitLine}
                  onClick={() => screenfull.toggle()}
                />
              </Flex>
            </Flex>
          </Flex>
          <ReactPlayer
            height="100vh"
            width="100vw"
            ref={this.refPlayer}
            url={currentVideo?.url}
            playing={playing}
            onPlay={this.handleUpdate}
            onPause={this.handleUpdate}
            onSeek={this.handleUpdate}
            onEnded={this.handleEnd}
            onProgress={this.handleProgress}
            onDuration={this.handleDuration}
          ></ReactPlayer>
        </Flex>
      </>
    );
  }
}

export default withRouter(VideoPlayer);
