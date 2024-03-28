import { styled } from "@linaria/react";
import { FC, PropsWithChildren } from "react";

import { TITLE_FONT_FAMILY, breakpointMediaQueries } from "../../../constants";

export type BaseContentProps = {};

export const BaseContent: FC<PropsWithChildren<BaseContentProps>> = ({ children }) => {
  return <Root>{children}</Root>;
};

const Root = styled.div`
  color: #463c64;
  a {
    color: #463c64;
  }

  & > h2 {
    font-family: ${TITLE_FONT_FAMILY};
  }

  & > h2 {
    font-weight: bold;
    font-weight: lighter;
    font-size: 40px;
    margin: 0;
    margin-top: 60px;

    ${breakpointMediaQueries.md} {
      font-size: 25px;
      margin-top: 15px;
    }
  }

  & > h3,
  & > h4 {
    font-weight: bold;
    font-size: 40px;
    margin: 0;
    margin-top: 60px;

    ${breakpointMediaQueries.md} {
      font-size: 25px;
      margin-top: 10px;
    }
  }
  & > h3 {
    font-size: 30px;

    ${breakpointMediaQueries.md} {
      font-size: 18px;
    }
  }
  & > h4 {
    font-size: 20px;

    ${breakpointMediaQueries.md} {
      font-size: 16px;
    }
  }
  & > p,
  & > figure > p {
    font-size: 18px;
    line-height: 1.6;
    margin: 0;
    margin-top: 20px;

    ${breakpointMediaQueries.md} {
      font-size: 12px;
      margin-top: 5px;
    }
  }
  & > img,
  & > figure > img {
    margin-top: 20px;
    width: 100%;
    height: 100%;

    ${breakpointMediaQueries.md} {
      margin-top: 5px;
    }
  }
  & > figure {
    width: 100%;
    margin: 20px 0 0 0;
    padding: 0;

    ${breakpointMediaQueries.md} {
      margin-top: 5px;
    }
  }
  & > figure > figcaption,
  & > .source {
    display: inline-block;
    font-size: 14px;
    margin-top: 15px;

    ${breakpointMediaQueries.md} {
      font-size: 10px;
      margin-top: 5px;
    }
  }
  & > .subtitle {
    display: inline-block;
    font-size: 20px;
    font-weight: bold;
    margin-top: 20px;

    ${breakpointMediaQueries.md} {
      font-size: 16px;
      margin-top: 5px;
    }
  }
`;
