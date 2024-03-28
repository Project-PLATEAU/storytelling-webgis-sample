import { useCallback } from "react";
import { useSound } from "use-sound";

import { useSoundContext } from "../contexts/SoundContexts";

// type PlayId = "first" | "second" | "third" | "fourth";
type PlayId = "on" | "off";

// export const useEffectSound = () => {
//   const { sound } = useSoundContext();
//   const sprite: Record<PlayId, [number, number]> = {
//     first: [0, 200],
//     second: [5000, 5200],
//     third: [10000, 10200],
//     fourth: [150000, 15200],
//   };
//   const [play] = useSound("music/effect.wav", {
//     sprite,
//     interrupt: true,
//     volume: 0.5,
//   });

//   const handlePlay = useCallback(
//     (id: PlayId) => {
//       if (sound === "on") {
//         play({ id });
//       }
//     },
//     [play, sound],
//   );

//   return {
//     play: handlePlay,
//   };
// };

export const useEffectSound = () => {
  const { sound } = useSoundContext();
  const [playOn] = useSound("music/on.mp3", {
    interrupt: true,
    volume: 0.5,
  });
  const [playOff] = useSound("music/off.mp3", {
    interrupt: true,
    volume: 0.5,
  });

  const handlePlay = useCallback(
    (id: PlayId) => {
      if (sound === "on") {
        switch (id) {
          case "on":
            playOn();
            break;
          case "off":
            playOff();
            break;
        }
      }
    },
    [sound, playOn, playOff],
  );

  return {
    play: handlePlay,
  };
};
