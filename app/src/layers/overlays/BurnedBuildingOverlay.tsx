import { styled } from "@linaria/react";
import { FC, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { MINMIZED_REPORT_WIDTH } from "../../components/MinimizedReport";
import { breakPoint, breakpointMediaQueries, GOTHIC_FONT_FAMILY } from "../../constants";
import { useMediaQuery } from "../../hooks";
import { OverlayContentProps } from "../../map/layers";
import { splitN } from "../../utils";

type Props = OverlayContentProps & {
  isToshin: boolean;
  data: { name: string; values: number[]; total?: number }[];
  getColor: (v: number) => string;
};

export const BurnedBuildingOverlay: FC<Props> = memo(
  function BurnedBuildingOverlayPresenter({ show, data, getColor, isToshin }) {
    const {
      t,
      i18n: { language },
    } = useTranslation();
    const isBreakpointMd = useMediaQuery(`(max-width: ${breakPoint.md}px)`);
    const gridRef = useRef<HTMLDivElement>(null);
    const imageURL = useMemo(() => {
      if (isToshin) {
        return language === "en"
          ? "img/burned-overlay/toshin-en-sp.png"
          : "img/burned-overlay/toshin-ja-sp.png";
      } else {
        return language === "en"
          ? "img/burned-overlay/tama-en-sp.png"
          : "img/burned-overlay/tama-ja-sp.png";
      }
    }, [isToshin, language]);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (!show || !isBreakpointMd) return;
        if (!gridRef.current) return;
        const timer = window.setTimeout(() => {
          import("html-to-image").then(({ toPng }) => {
            if (!gridRef.current) return;
            toPng(gridRef.current).then(blob => {
              console.log("BURNED OVERLAY IMAGE: ", blob);
              return;
            });
          });
        }, 10000);
        return () => window.clearTimeout(timer);
      }, [show, isBreakpointMd]);
    }

    if (!show) return;
    return (
      <Root>
        {!isBreakpointMd && (
          <TextContainer>
            <Title>
              {splitN(
                t(
                  "Let's take a look at the distribution of burned buildings by municipalities on a map.",
                ),
              )}
            </Title>
            <Description>
              {splitN(
                t(
                  "Have you identified any areas where you live or where your school/workplace is located? This data could be a starting point for researching fireproofing measures for nearby locations.",
                ),
              )}
            </Description>
          </TextContainer>
        )}
        <Container>
          {isBreakpointMd && (
            <Description>
              {splitN(
                t(
                  "Let's take a look at the distribution of burned buildings by municipalities on a map. Have you identified any areas where you live or where your school/workplace is located? This data could be a starting point for researching fireproofing measures for nearby locations.",
                ),
              )}
            </Description>
          )}
          {isBreakpointMd ? (
            <GridImageContainer>
              <GridImage src={imageURL} />
            </GridImageContainer>
          ) : (
            <GridRoot ref={gridRef}>
              {data.map(({ name, values }) =>
                name.endsWith("区") ? (
                  <GridItem
                    key={name}
                    originalName={name}
                    name={t(name)}
                    values={values}
                    getColor={getColor}
                  />
                ) : null,
              )}
            </GridRoot>
          )}
        </Container>
      </Root>
    );
  },
  (prev, next) =>
    prev.data === next.data && prev.getColor === next.getColor && prev.show === next.show,
);

const GridItem = ({
  originalName,
  name,
  values,
  getColor,
}: { originalName: string; name: string; values: number[] } & Pick<Props, "getColor">) => {
  return (
    <Item>
      <Label>{name}</Label>
      <RectList originalName={originalName} values={values} getColor={getColor} />
    </Item>
  );
};

const RectList: FC<{ originalName: string; values: number[] } & Pick<Props, "getColor">> = memo(
  function RectListPresenter({ originalName, values, getColor }) {
    return (
      <Grid>
        {values.map((v, i) =>
          Math.floor(Math.random() * 10) % 3 === 0 ? (
            <RectWrapper key={`${originalName}_${v}_${i}`} color={getColor(v)} />
          ) : (
            <NonTransformRectWrapper key={`${originalName}_${v}_${i}`} color={getColor(v)} />
          ),
        )}
      </Grid>
    );
  },
  (prev, next) =>
    prev.originalName === next.originalName &&
    prev.values === next.values &&
    prev.getColor === next.getColor,
);

const RectWrapper = ({ color }: { color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, overX: 0, overY: 0 });

  useLayoutEffect(() => {
    const minX = window.innerWidth / 3;
    const minY = window.innerHeight / 2.3;
    const boundingBox = {
      minX,
      minY,
      maxX: window.innerWidth - minX,
      maxY: window.innerHeight - minY,
    };
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = (boundingBox.minX + boundingBox.maxX) / 2;
    const centerY = (boundingBox.minY + boundingBox.maxY) / 2;
    const baseX = centerX - rect.left;
    const baseY = centerY - rect.top;

    const lengthX = boundingBox.maxX - boundingBox.minX;
    const lengthY = boundingBox.maxY - boundingBox.minY;

    const randomX = Math.random() * lengthX - lengthX / 2;
    const randomY = Math.random() * lengthY - lengthY / 2;

    const x = baseX + randomX;
    const y = baseY + randomY;

    const overX = Math.random() * 20 - Math.random() * 15;
    const overY = Math.random() * 20 - Math.random() * 15;

    setPosition({
      x,
      y,
      overX,
      overY,
    });
    setInitialized(true);
  }, []);

  return (
    <Rect
      ref={ref}
      color={color}
      x={position.x}
      y={position.y}
      overX={position.overX}
      overY={position.overY}
      className={initialized ? "play" : ""}
      style={{ animationDelay: `${Math.random()}s` }}
    />
  );
};

const NonTransformRectWrapper = ({ color }: { color: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useLayoutEffect(() => {
    setInitialized(true);
  }, []);

  return <NonTransformRect ref={ref} color={color} className={initialized ? "play" : ""} />;
};

const Root = styled.div`
  z-index: 0;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(230, 230, 251, 0);
  padding-left: 80px;
  padding-right: ${MINMIZED_REPORT_WIDTH + 32 + 30}px;
  box-sizing: border-box;
  will-change: transform, opacity;
  background-color: rgba(230, 230, 251, 0.9);
  opacity: 0;

  animation: 1s ease-out 0.5s fadein;
  animation-fill-mode: forwards;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  ${breakpointMediaQueries.md} {
    padding: 10px;
    z-index: 1;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin-top: 60px;

  ${breakpointMediaQueries.md} {
    margin-top: -40px;
  }
`;

const TextContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  gap: 0 35px;
  position: absolute;
  margin-top: 130px;
  margin-left: 50px;
  margin-right: 100px;
`;

const Title = styled.div`
  font-size: 25px;
  color: #463c64;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
`;

const Description = styled.div`
  font-size: 18px;
  margin-bottom: 25px;
  color: #463c64;
  max-width: 1000px;

  opacity: 0;

  animation: 1s ease-out 0s fadein;
  animation-fill-mode: forwards;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  ${breakpointMediaQueries.md} {
    font-size: 10px;
    margin-bottom: 10px;
    max-width: 100%;
  }
`;

const GridImageContainer = styled.div`
  width: 90%;
`;

const GridImage = styled.img`
  width: 100%;
  height: auto;
`;

const GridRoot = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 30px 1%;
  width: 100%;
  max-width: 65vw;
  background: transparent;

  ${breakpointMediaQueries.md} {
    max-width: 100%;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px 3%;
  }
`;

const Item = styled.div`
  display: flex;
  gap: 10px 0;
  flex-direction: column;
  align-items: center;
  width: 100%;

  ${breakpointMediaQueries.md} {
    gap: 5px 0;
  }
`;

const Label = styled.div`
  flex: 0;
  font-size: 14px;
  color: #463c64;
  opacity: 0;
  height: 100%;
  font-family: ${GOTHIC_FONT_FAMILY};

  animation: 1s ease-out 2s fadein;
  animation-fill-mode: forwards;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  ${breakpointMediaQueries.md} {
    font-size: 8px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(18, minmax(0px, 1fr));
  grid-template-rows: auto;
  gap: 1px;
  width: 100%;

  ${breakpointMediaQueries.md} {
    grid-template-columns: repeat(20, minmax(0px, 1fr));
  }
`;

const Rect = styled.div<{
  color: string;
  x: number;
  y: number;
  overX: number;
  overY: number;
}>`
  --transformX: ${({ x }) => `${x}px`};
  --transformY: ${({ y }) => `${y}px`};
  --transformOverX: ${({ overX }) => `${overX}px`};
  --transformOverY: ${({ overY }) => `${overY}px`};

  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  background-color: ${({ color }) => color};
  transform: translate(var(--transformX), var(--transformY));

  &.play {
    opacity: 0;
    animation:
      2s ease-out 0s slidein,
      1s ease-in-out 0s fadein;
    animation-fill-mode: forwards;
    @keyframes slidein {
      0% {
        transform: translate(var(--transformX), var(--transformY));
      }
      70% {
        transform: translate(var(--transformOverX), var(--transformOverY));
      }
      100% {
        transform: translate(0%, 0%);
      }
    }
    @keyframes fadein {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
`;

const NonTransformRect = styled.div<{
  color: string;
}>`
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  background-color: ${({ color }) => color};

  &.play {
    opacity: 0;
    animation: 1s ease-in-out 2s fadein;
    animation-fill-mode: forwards;
    @keyframes fadein {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
`;
