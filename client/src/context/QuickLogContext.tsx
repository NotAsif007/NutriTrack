import React, { createContext, useContext, useState, useCallback } from "react";
import { MealType } from "../types";

interface QuickLogContextType {
  isQuickLogOpen: boolean;
  openQuickLog: () => void;
  closeQuickLog: () => void;
  isFoodSearchOpen: boolean;
  activeMeal: MealType;
  openFoodSearch: (meal?: MealType) => void;
  closeFoodSearch: () => void;
  isWeightOpen: boolean;
  openWeightModal: () => void;
  closeWeightModal: () => void;
  isCustomFoodOpen: boolean;
  openCustomFoodModal: () => void;
  closeCustomFoodModal: () => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const QuickLogContext = createContext<QuickLogContextType | undefined>(undefined);

export const QuickLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isFoodSearchOpen, setIsFoodSearchOpen] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealType>("Breakfast");
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [isCustomFoodOpen, setIsCustomFoodOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openQuickLog = useCallback(() => setIsQuickLogOpen(true), []);
  const closeQuickLog = useCallback(() => setIsQuickLogOpen(false), []);

  const openFoodSearch = useCallback((meal: MealType = "Breakfast") => {
    setActiveMeal(meal);
    setIsQuickLogOpen(false);
    setIsFoodSearchOpen(true);
  }, []);

  const closeFoodSearch = useCallback(() => setIsFoodSearchOpen(false), []);

  const openWeightModal = useCallback(() => {
    setIsQuickLogOpen(false);
    setIsWeightOpen(true);
  }, []);

  const closeWeightModal = useCallback(() => setIsWeightOpen(false), []);

  const openCustomFoodModal = useCallback(() => {
    setIsQuickLogOpen(false);
    setIsCustomFoodOpen(true);
  }, []);

  const closeCustomFoodModal = useCallback(() => setIsCustomFoodOpen(false), []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <QuickLogContext.Provider
      value={{
        isQuickLogOpen,
        openQuickLog,
        closeQuickLog,
        isFoodSearchOpen,
        activeMeal,
        openFoodSearch,
        closeFoodSearch,
        isWeightOpen,
        openWeightModal,
        closeWeightModal,
        isCustomFoodOpen,
        openCustomFoodModal,
        closeCustomFoodModal,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </QuickLogContext.Provider>
  );
};

export const useQuickLog = (): QuickLogContextType => {
  const context = useContext(QuickLogContext);
  if (!context) {
    return {
      isQuickLogOpen: false,
      openQuickLog: () => {},
      closeQuickLog: () => {},
      isFoodSearchOpen: false,
      activeMeal: "Breakfast",
      openFoodSearch: () => {},
      closeFoodSearch: () => {},
      isWeightOpen: false,
      openWeightModal: () => {},
      closeWeightModal: () => {},
      isCustomFoodOpen: false,
      openCustomFoodModal: () => {},
      closeCustomFoodModal: () => {},
      refreshKey: 0,
      triggerRefresh: () => {},
    };
  }
  return context;
};
