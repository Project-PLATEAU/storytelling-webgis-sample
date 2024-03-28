import { FC, ReactElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { BaseLayer, BaseLayerProps } from "./BaseLayer";

export type OverlayContentProps = {
  show: boolean;
};

export type OverlayLayer = BaseLayer<{
  id: string;
  type: "overlay";
  delay?: number;
  renderContent: (props: OverlayContentProps) => ReactElement | null;
}>;

export type OverlayProps = BaseLayerProps<OverlayLayer>;

export const Overlay: FC<OverlayProps> = ({ show = true, hide, delay, renderContent }) => {
  const [shouldShow, setShouldShow] = useState(!delay);
  useEffect(() => {
    if (!show) {
      setShouldShow(false);
      return;
    }
    let timer: number;
    if (delay) {
      timer = window.setTimeout(() => {
        setShouldShow(true);
      }, delay);
    }

    return () => {
      window.clearTimeout(timer);
    };
  }, [show, delay]);

  const content = renderContent({ show: !hide && shouldShow });

  return content ? createPortal(content, document.body) : null;
};
