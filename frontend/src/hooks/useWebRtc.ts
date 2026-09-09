import { useRef, useState } from "react";

interface RemoteStream {
  userId: number;
  stream: MediaStream;
  userName: string;
}

const useWebRTC = (meetingId: number) => {
  const [localStream, setLocalStream] =
    useState<MediaStream | null>(null);

  const [remoteStreams, setRemoteStreams] =
    useState<RemoteStream[]>([]);

  const peers = useRef<
    Map<number, RTCPeerConnection>
  >(new Map());

  const startCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setLocalStream(stream);

      return stream;
    } catch (error) {
      console.error(
        "Camera/microphone permission failed",
        error
      );

      throw error;
    }
  };

  const stopCamera = () => {
    if (!localStream) {
      return;
    }

    localStream.getTracks().forEach((track) => {
      track.stop();
    });

    setLocalStream(null);
  };

  const toggleAudio = () => {
    if (!localStream) {
      return;
    }

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  const toggleVideo = () => {
    if (!localStream) {
      return;
    }

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  const createPeerConnection = (
    userId: number,
    userName: string
  ) => {
    const configuration: RTCConfiguration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    const peer =
      new RTCPeerConnection(configuration);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream);
      });
    }

    peer.ontrack = (event) => {
      const stream = event.streams[0];

      if (!stream) {
        return;
      }

      setRemoteStreams((current) => {
        const exists = current.some(
          (item) => item.userId === userId
        );

        if (exists) {
          return current.map((item) =>
            item.userId === userId
              ? {
                  ...item,
                  stream,
                }
              : item
          );
        }

        return [
          ...current,
          {
            userId,
            userName,
            stream,
          },
        ];
      });
    };

    peers.current.set(userId, peer);

    return peer;
  };

  const removePeer = (userId: number) => {
    const peer = peers.current.get(userId);

    if (peer) {
      peer.close();
      peers.current.delete(userId);
    }

    setRemoteStreams((current) =>
      current.filter(
        (item) => item.userId !== userId
      )
    );
  };

  const startScreenShare = async () => {
    try {
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

      const screenTrack =
        screenStream.getVideoTracks()[0];

      peers.current.forEach((peer) => {
        const sender = peer
          .getSenders()
          .find(
            (item) =>
              item.track?.kind === "video"
          );

        if (sender) {
          sender.replaceTrack(screenTrack);
        }
      });

      screenTrack.onended = () => {
        if (!localStream) {
          return;
        }

        const cameraTrack =
          localStream.getVideoTracks()[0];

        peers.current.forEach((peer) => {
          const sender = peer
            .getSenders()
            .find(
              (item) =>
                item.track?.kind === "video"
            );

          if (sender && cameraTrack) {
            sender.replaceTrack(cameraTrack);
          }
        });
      };
    } catch (error) {
      console.error(
        "Screen sharing failed",
        error
      );
    }
  };

  const stopScreenShare = () => {
    // The browser stops the screen stream
    // when the user ends sharing.
  };

  return {
    meetingId,
    localStream,
    remoteStreams,
    peers,
    startCamera,
    stopCamera,
    toggleAudio,
    toggleVideo,
    createPeerConnection,
    removePeer,
    startScreenShare,
    stopScreenShare,
  };
};

export default useWebRTC;