import { styled } from "@linaria/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { breakPoint } from "../../constants";
import { useMediaQuery } from "../../hooks";

export const PICTURE_SLIDER_TIMEOUT = 4000;

const IMAGES = [
  "img/opening/op1.webp",
  "img/opening/op2.webp",
  "img/opening/op3.webp",
  "img/opening/op4.webp",
  "img/opening/op5.webp",
];

const makePreloadPictureSlider = () => {
  const links = IMAGES.map(img => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = img;
    link.as = "image";
    return link;
  });
  document.querySelector("head")?.append(...links);
};
makePreloadPictureSlider();

export const OpeningPictureSlider: FC<{
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
}> = ({ onAnimationStart, onAnimationEnd }) => {
  const [shouldShow, setShouldShow] = useState(false);
  const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);

  useEffect(() => {
    onAnimationStart?.();
    const timer = window.setTimeout(() => {
      onAnimationEnd?.();
    }, PICTURE_SLIDER_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [onAnimationStart, onAnimationEnd]);

  const imageCountRef = useRef(0);
  const handleOnLoad = useCallback(() => {
    imageCountRef.current++;
    if (imageCountRef.current >= IMAGES.length) {
      setShouldShow(true);
    }
  }, []);

  return (
    <Root>
      <PictureSlider
        url={IMAGES[1]}
        width={!isBreakpointMd ? "30%" : "50%"}
        posPercent={0}
        y="1%"
        delay={0.2}
        duration={52}
        imageWidth={600}
        imageHeight={450}
        show={shouldShow}
        onLoad={handleOnLoad}
      />
      <PictureSlider
        url={IMAGES[3]}
        width={!isBreakpointMd ? "15%" : "25%"}
        posPercent={!isBreakpointMd ? 8 : 6}
        y={!isBreakpointMd ? "3%" : "5%"}
        delay={0.8}
        duration={29}
        imageWidth={400}
        imageHeight={300}
        show={shouldShow}
        onLoad={handleOnLoad}
      />
      <PictureSlider
        url={IMAGES[0]}
        width={!isBreakpointMd ? "30%" : "40%"}
        posPercent={!isBreakpointMd ? 4 : 5}
        y={!isBreakpointMd ? "20%" : "35%"}
        delay={0}
        duration={50}
        imageWidth={520}
        imageHeight={390}
        show={shouldShow}
        onLoad={handleOnLoad}
      />
      <PictureSlider
        url={IMAGES[2]}
        width={!isBreakpointMd ? "25%" : "50%"}
        posPercent={!isBreakpointMd ? 1 : 0}
        y={!isBreakpointMd ? "60%" : "55%"}
        delay={0.6}
        duration={28}
        imageWidth={400}
        imageHeight={300}
        show={shouldShow}
        onLoad={handleOnLoad}
      />
      <PictureSlider
        url={IMAGES[4]}
        width={!isBreakpointMd ? "25%" : "40%"}
        posPercent={!isBreakpointMd ? 6.5 : 5}
        y={!isBreakpointMd ? "70%" : "80%"}
        delay={0.4}
        duration={27}
        imageWidth={600}
        imageHeight={450}
        show={shouldShow}
        onLoad={handleOnLoad}
      />
    </Root>
  );
};

const PictureSlider: FC<{
  url: string;
  width: string;
  posPercent: number;
  duration?: number;
  y: string;
  delay: number;
  imageWidth: number;
  imageHeight: number;
  show?: boolean;
  onLoad?: () => void;
}> = ({
  url,
  width,
  posPercent,
  duration = 30,
  y,
  delay,
  imageWidth,
  imageHeight,
  onLoad,
  show,
}) => {
  return (
    <>
      <Slider className={show ? "first" : "hide"} posPercent={posPercent} duration={duration} y={y}>
        <ImageContainer width={width} delay={delay}>
          <Image
            alt=""
            src={url}
            width={imageWidth}
            height={imageHeight}
            decoding="async"
            onLoad={onLoad}
            className={show ? "" : "hide"}
          />
        </ImageContainer>
      </Slider>
      <Slider className={show ? "" : "hide"} posPercent={posPercent} duration={duration} y={y}>
        <ImageContainer width={width} delay={delay}>
          <Image
            alt=""
            className={show ? "" : "hide"}
            src={url}
            width={imageWidth}
            height={imageHeight}
            decoding="async"
          />
        </ImageContainer>
      </Slider>
    </>
  );
};

const DELAY_FOR_SLIDER = 1.5;

const Root = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(70, 60, 100, 1);

  animation: 1s linear 2s 1 normal forwards running fadeout;

  @keyframes fadeout {
    to {
      background-color: rgba(70, 60, 100, 0);
    }
  }
`;

const Slider = styled.div<{ y: string; duration: number; posPercent: number }>`
  --x: ${({ posPercent }) => `${posPercent * 10}%`};
  --duration: ${({ duration }) => `${duration}s`};
  --firstDuration: ${({ duration }) => `${duration / 2}s`};
  --firstDelay: ${({ duration }) => `${duration / 2 + DELAY_FOR_SLIDER}s`};
  --y: ${({ y }) => y};

  position: absolute;
  top: var(--y);
  left: var(--x);
  width: 100%;
  transform: translateX(-100%);

  &.first {
    transform: translateX(0%);
    animation:
      var(--firstDuration) linear ${DELAY_FOR_SLIDER}s 1 normal none running slide-first,
      var(--duration) linear var(--firstDelay) infinite normal none running slide;
  }

  animation: var(--duration) linear ${DELAY_FOR_SLIDER}s infinite normal none running slide;

  @keyframes slide-first {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(100%);
    }
  }
  @keyframes slide {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  &.hide {
    animation: none;
    display: none;
  }
`;

const ImageContainer = styled.div<{ width: string; delay: number }>`
  position: relative;
  width: ${({ width }) => width};

  position: relative;
  box-sizing: border-box;

  transform-origin: bottom;

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    background-color: rgba(70, 60, 100, 1);
    padding: 1px;
    animation: 0.5s ease-out 0s 1 normal forwards running slidein;
    animation-delay: ${({ delay }) => `${delay}s`};
    @keyframes slidein {
      to {
        height: 0%;
        padding: 0;
      }
    }
  }

  &.hide {
    animation: none;
    display: none;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
