import { styled } from "@linaria/react";
import { motion } from "framer-motion";
import { FC, PropsWithChildren, useState, useEffect, useCallback } from "react";

import { ParticleOverlay } from "../components/ParticleOverlay";
import { breakpointMediaQueries, breakPoint } from "../constants";
import { ForTheFuture, Epilogue } from "../contents/Epilogue";
import { useNavigationContext } from "../contexts/NavigationContexts";
import { useEffectSound, useMediaQuery } from "../hooks";
import { MainScenes } from "../utils/types/common";

const SWITCH_IMAGE_DELAY = 3000;
const EXPAND_IMAGE_DELAY = 6000;
const TEXT_DELAY = 3000;

export const EpilogueContainer: FC<PropsWithChildren> = ({ children }) => {
  const { setCurrentScene } = useNavigationContext();
  const [isCurrentImageVisible, setIsCurrentImageVisible] = useState(false);
  const [isCurrentImageExpanded, setIsCurrentImageExpanded] = useState(false);
  const [show, setShow] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const { play } = useEffectSound();
  const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);

  const handleEffectSoundForClick = useCallback(() => {
    play("on");
  }, [play]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsCurrentImageVisible(true);
    }, SWITCH_IMAGE_DELAY);

    const timer2 = setTimeout(() => {
      setIsCurrentImageExpanded(true);
    }, EXPAND_IMAGE_DELAY);

    const timer3 = setTimeout(() => {
      setShow(true);
    }, EXPAND_IMAGE_DELAY + TEXT_DELAY);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleBackButton = () => {
    setCurrentScene(MainScenes.Scene1);
  };

  return (
    <Root showMoreDetails={showMoreDetails} show={show}>
      {children}
      <Content>
        {showMoreDetails && (
          <BackButton onClick={handleBackButton}>
            <img src="img/content/epilogue/btn-back.png" alt="back" />
          </BackButton>
        )}
        <ImageContainer>
          <motion.div
            style={{
              width: isBreakpointMd ? "80%" : "60%",
              height: isBreakpointMd ? "30%" : "60%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <motion.img
              src="img/content/epilogue/tokyo_past.webp"
              alt="Tokyo Past"
              initial={{ opacity: 0 }}
              animate={isCurrentImageExpanded ? { opacity: 0 } : { opacity: 1 }}
              transition={isCurrentImageExpanded ? { duration: 3 } : { duration: 3 }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </motion.div>
          {isCurrentImageVisible && (
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{
                duration: 2,
                delay: 1,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              style={{
                width: isBreakpointMd ? "80%" : "60%",
                height: isBreakpointMd ? "30%" : "60%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <motion.img
                src="img/content/epilogue/tokyo_current.webp"
                alt="Tokyo Current"
                initial={{ opacity: 0 }}
                animate={isCurrentImageExpanded ? { opacity: 0 } : { opacity: 1 }}
                transition={isCurrentImageExpanded ? { duration: 3 } : { duration: 3, delay: 0 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </motion.div>
          )}
          {isCurrentImageExpanded && (
            <motion.div
              initial={{
                width: isBreakpointMd ? "80%" : "60%",
                height: isBreakpointMd ? "30%" : "60%",
              }}
              animate={{
                width: "100%",
                height: "100%",
              }}
              transition={{
                duration: 2,
                delay: 1,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                position: "absolute",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
              <motion.img
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2, delay: 5 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src="img/content/epilogue/tokyo_current.webp"
                alt="Tokyo Current Expanded"
              />
            </motion.div>
          )}
        </ImageContainer>
        {show && (
          <>
            {!showMoreDetails && (
              <TextContainer>
                <ForTheFuture setShowMoreDetails={setShowMoreDetails} />
              </TextContainer>
            )}

            {showMoreDetails && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}>
                <Epilogue onClick={handleEffectSoundForClick} handleBackButton={handleBackButton} />
              </motion.div>
            )}
          </>
        )}
      </Content>
      <ParticleOverlay
        show={show && !showMoreDetails}
        backgroundColor="#e6e6fa"
        backgroundOpacity={0}
        particleColor="#fff"
        delay={3500}
      />
    </Root>
  );
};

const Root = styled.div<{ showMoreDetails: boolean; show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 100svh;
  height: 100dvh;
  background-color: ${({ showMoreDetails, show }) =>
    showMoreDetails ? "#ffffff" : show ? "rgba(230, 230, 250, 0.3)" : "rgba(230, 230, 250, 0.7)"};
  padding-bottom: 100px;
  overflow-x: hidden;
  overflow-y: auto;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const BackButton = styled.button`
  position: absolute;
  top: 150px;
  left: 30px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1;

  & img {
    width: 60px;
    height: 60px;

    ${breakpointMediaQueries.md} {
      width: 45px;
      height: 45px;
    }
  }

  ${breakpointMediaQueries.md} {
    top: 80px;
    left: 20px;
  }
`;

const ImageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
`;

const TextContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  ${breakpointMediaQueries.md} {
    padding: 2rem 0;
  }
`;
