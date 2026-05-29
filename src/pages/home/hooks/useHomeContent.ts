import { useEffect } from "react";

import { homeService } from "@/pages/home/services/home.service";
import { useAppStore } from "@/shared/store/app.store";

export const useHomeContent = () => {
  const homeListingData = useAppStore((state) => state.homeListingData);
  const isHomeListingLoading = useAppStore((state) => state.isHomeListingLoading);
  const homeListingError = useAppStore((state) => state.homeListingError);
  const setHomeListingLoading = useAppStore((state) => state.setHomeListingLoading);
  const setHomeListingData = useAppStore((state) => state.setHomeListingData);
  const setHomeListingError = useAppStore((state) => state.setHomeListingError);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      setHomeListingLoading(true);
      setHomeListingError("");

      try {
        const response = await homeService.fetchListingData();

        if (!isMounted) {
          return;
        }

        setHomeListingData(response);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unable to load homepage data.";
        setHomeListingError(message);
      } finally {
        if (isMounted) {
          setHomeListingLoading(false);
        }
      }
    };

    if (!homeListingData && isHomeListingLoading) {
      void fetchContent();
    }

    return () => {
      isMounted = false;
    };
  }, [
    homeListingData,
    isHomeListingLoading,
    setHomeListingData,
    setHomeListingError,
    setHomeListingLoading,
  ]);

  return {
    homeListingData,
    isHomeListingLoading,
    homeListingError,
  };
};
