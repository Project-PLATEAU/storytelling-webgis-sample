import { createContext, useContext, useState, FC, PropsWithChildren, useEffect } from "react";

import { FirstVisit } from "../utils/types/common";

type FirstVisitContextType = {
  firstVisit: FirstVisit;
  setFirstVisit: React.Dispatch<React.SetStateAction<FirstVisit>>;
};

const FirstVisitContext = createContext<FirstVisitContextType>({
  firstVisit: { disclaimerAccepted: false, isTutorialCompleted: false },
  setFirstVisit: () => {},
});

export const FirstVisitProvider: FC<PropsWithChildren> = ({ children }) => {
  const [firstVisit, setFirstVisit] = useState<FirstVisit>(() => {
    const storedFirstVisit = localStorage.getItem("firstVisit");
    return storedFirstVisit
      ? JSON.parse(storedFirstVisit)
      : {
          disclaimerAccepted: false,
          isTutorialCompleted: false,
        };
  });

  useEffect(() => {
    localStorage.setItem("firstVisit", JSON.stringify(firstVisit));
  }, [firstVisit]);

  return (
    <FirstVisitContext.Provider value={{ firstVisit, setFirstVisit }}>
      {children}
    </FirstVisitContext.Provider>
  );
};

export const useFirstVisitContext = () => useContext(FirstVisitContext);
