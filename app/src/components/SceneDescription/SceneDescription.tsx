import { styled } from "@linaria/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { breakpointMediaQueries } from "../../constants";
import { splitN, NavigationState, MainScenes } from "../../utils";

export type SceneDescriptionProps = {
  content: string;
  source?: { title?: string; url?: string };
  color?: string;
  lineHeight?: string;
  navigationState: NavigationState;
};

export const SceneDescription: React.FC<SceneDescriptionProps> = ({
  content,
  source,
  color = "#463C64",
  lineHeight = "200%",
  navigationState,
}) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const { currentScene } = navigationState;
  const shouldSmallFont = isEn && currentScene === MainScenes.Scene5;

  const brContents = useMemo(() => splitN(content), [content]);

  return (
    <Root color={color}>
      <Content lineHeight={lineHeight} shouldSmallFont={shouldSmallFont}>
        {brContents}
      </Content>
      {source && source.title && source.url && (
        <Source>
          {t("Source: ")}
          <Link href={source.url} target="_blank">
            {source.title}
          </Link>
        </Source>
      )}
    </Root>
  );
};

const Root = styled.div<{ color: string }>`
  max-width: 360px;
  color: ${({ color }) => color};
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
  box-sizing: border-box;
`;

const Content = styled.div<{ lineHeight: string; shouldSmallFont: boolean }>`
  font-size: 18px;
  line-height: ${({ lineHeight }) => lineHeight};
  font-weight: lighter;
  ${breakpointMediaQueries.md} {
    font-size: ${({ shouldSmallFont }) => (shouldSmallFont ? 8 : 10)}px;
    line-height: 120%;
  }
`;
const Source = styled.div`
  font-size: 14px;
  ${breakpointMediaQueries.md} {
    font-size: 10px;
    line-height: 130%;
  }
`;
const Link = styled.a`
  color: inherit;
  pointer-events: auto;
`;
