import { computePosition, size, flip, offset, shift } from "@floating-ui/dom";
import { styled } from "@linaria/react";
import { FC, PropsWithChildren, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trans } from "react-i18next";

import { breakPoint, breakpointMediaQueries } from "../../constants";
import { useMediaQuery } from "../../hooks";
import { Close } from "../icons/Close";

type InfoTooltipProps = {
  contentKey: string;
};

export const InfoTooltip: FC<PropsWithChildren<InfoTooltipProps>> = ({ contentKey, children }) => {
  const referenceRef = useRef<HTMLDivElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);

  useEffect(() => {
    if (referenceRef.current && floatingRef.current) {
      computePosition(referenceRef.current, floatingRef.current, {
        placement: isBreakpointMd ? "bottom" : "top",
        middleware: [
          offset(isBreakpointMd ? { mainAxis: 0, crossAxis: (window.innerHeight - 300) / 2 } : 5),
          flip(),
          shift({ padding: 10 }),
          size({
            apply({ elements, availableWidth, rects }) {
              const maxWidth = Math.min(300, availableWidth - 10);
              elements.floating.style.width = `${maxWidth}px`;

              if (isBreakpointMd) {
                elements.floating.style.height = `400px`;
              } else {
                const buttonTop = rects.reference.y;
                const marginTop = 30;
                const maxHeight = buttonTop - marginTop;
                elements.floating.style.maxHeight = `${maxHeight}px`;
                elements.floating.style.overflowY = "auto";
              }
            },
          }),
        ],
      }).then(({ x, y }) => {
        if (floatingRef.current) {
          Object.assign(floatingRef.current.style, {
            left: isBreakpointMd ? "50%" : `${x}px`,
            top: isBreakpointMd ? "50%" : `${y}px`,
            position: isBreakpointMd ? "fixed" : "absolute",
            transform: isBreakpointMd ? "translate(-50%, -50%)" : undefined,
            visibility: isTooltipVisible ? "visible" : "hidden",
          });
        }
      });
    }
  }, [isTooltipVisible, isBreakpointMd]);

  useEffect(() => {
    if (isBreakpointMd) return;

    const hideTooltip = () => {
      if (!isMouseOver) {
        setIsTooltipVisible(false);
      }
    };

    const timer = setTimeout(hideTooltip, 100);
    return () => clearTimeout(timer);
  }, [isMouseOver, isBreakpointMd]);

  const tooltipContent = (
    <Trans
      i18nKey={contentKey}
      components={{
        l1: (
          <a
            href="https://elaws.e-gov.go.jp/document?lawid=325CO0000000338#Mp-Ch_4"
            target="_blank"
            rel="noreferrer">
            l1
          </a>
        ),
        l2: (
          <a href="https://www.mlit.go.jp/common/001215161.pdf" target="_blank" rel="noreferrer">
            l2
          </a>
        ),
        l3: (
          <a
            href="https://www.ur-net.go.jp/chintai/college/202004/000503.html"
            target="_blank"
            rel="noreferrer">
            l3
          </a>
        ),
        l4: (
          <a
            href="https://elaws.e-gov.go.jp/document?lawid=343AC0000000100#Mp-Ch_2-Se_1"
            target="_blank"
            rel="noreferrer">
            l4
          </a>
        ),
        l5: (
          <a
            href="https://www.fdma.go.jp/singi_kento/kento/items/kento187_32_shiryo1-3.pdf"
            target="_blank"
            rel="noreferrer">
            l5
          </a>
        ),
        l6: (
          <a
            href="https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/021/571/20220525/n/002n.pdf"
            target="_blank"
            rel="noreferrer">
            l6
          </a>
        ),
        l7: (
          <a
            href="https://www.bousai.metro.tokyo.lg.jp/_res/projects/default_project/_page_/001/000/401/assumption.part3-4-2.pdf"
            target="_blank"
            rel="noreferrer">
            l7
          </a>
        ),
      }}
    />
  );

  return (
    <div>
      <TextWrapper
        ref={referenceRef}
        onMouseEnter={() => {
          setIsTooltipVisible(true);
          setIsMouseOver(true);
        }}
        onMouseLeave={() => setIsMouseOver(false)}>
        {children}
      </TextWrapper>
      {isTooltipVisible && (
        <>
          {isBreakpointMd &&
            createPortal(
              <TooltipOverlay onClick={() => setIsTooltipVisible(false)} />,
              document.body,
            )}
          {createPortal(
            <Tooltip
              ref={floatingRef}
              onMouseEnter={() => setIsMouseOver(true)}
              onMouseLeave={() => setIsMouseOver(false)}>
              {isBreakpointMd && (
                <CloseButton onClick={() => setIsTooltipVisible(false)}>
                  <Close width={10} height={10} />
                </CloseButton>
              )}
              {tooltipContent}
            </Tooltip>,
            document.body,
          )}
        </>
      )}
    </div>
  );
};

const TextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 9px;
  text-align: center;
  cursor: pointer;
  position: relative;
  font-weight: bold;
  color: #fff;
  background: #463c64;
  margin-top: 2px;
`;

const TooltipOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(70, 60, 100, 0.9);
  z-index: 998;
`;

const Tooltip = styled.div`
  background-color: rgba(70, 60, 100, 0.9);
  color: #fff;
  padding: 10px;
  font-size: 10px;
  z-index: 999;
  position: absolute;
  visibility: hidden;

  a {
    color: #fff;
  }

  ${breakpointMediaQueries.md} {
    position: fixed;
    left: 50%;
    top: 50%;
    font-size: 12px;
    transform: translate(-50%, -50%);
    overflow-y: auto;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
`;
