import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
`;

const Video = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  pointer-events: none;
  user-select: none;
`;

const VIDEO_SRC = '/bg-1.mp4';

export function VideoBg() {
  return (
    <Wrapper aria-hidden>
      <Video
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
      />
    </Wrapper>
  );
}
