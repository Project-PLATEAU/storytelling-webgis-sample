import { styled } from "@linaria/react";
import { FC, useRef, useEffect, MutableRefObject } from "react";

type ScrollableContentsProps = {
  children: React.ReactElement[];
  onPageTransition?: (pageIndex: number) => void;
  ref?: MutableRefObject<HTMLDivElement | null>;
  updateKey?: string;
};

export const ScrollableContents: FC<ScrollableContentsProps> = ({ children, ref, updateKey }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const lastNotifiedIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo(0, 0);
    // const handleScroll = () => {
    //   if (containerRef.current) {
    //     const container = containerRef.current;
    //     for (let i = 0; i < children.length; i++) {
    //       const contentElement = container.children[i] as HTMLElement;

    //       if (
    //         contentElement.offsetTop <= container.scrollTop &&
    //         contentElement.offsetTop + contentElement.offsetHeight > container.scrollTop
    //         // Determines the Content located at the top edge of the Scrollable.
    //       ) {
    //         if (i !== lastNotifiedIndexRef.current) {
    //           onPageTransition(i);
    //           lastNotifiedIndexRef.current = i;
    //         }
    //         break;
    //       }
    //     }
    //   }
    // };

    // if (containerRef.current) {
    //   containerRef.current.addEventListener("scroll", handleScroll);
    // }

    // return () => {
    //   if (container) {
    //     container.removeEventListener("scroll", handleScroll);
    //   }
    // };
  }, [updateKey]);

  return (
    <Scrollable
      ref={e => {
        containerRef.current = e;
        if (ref) {
          ref.current = e;
        }
      }}>
      {children.map((Content, index) => (
        <div key={index}>{Content}</div>
      ))}
    </Scrollable>
  );
};

const Scrollable = styled.div`
  overflow-y: auto;
  max-height: 100%;
  height: 100%;
  padding: 20px 30px;
  box-sizing: border-box;
`;
