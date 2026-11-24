import { useCheckIns } from "@/queries/useCheckIns";
import { today } from "@/utils/utils";

/**
 * Today's check-in, if the user has done one. Reads from the cached check-ins list, so it makes no
 * extra request and updates as soon as a new check-in is saved (the save invalidates that list).
 */
export function useTodayCheckIn() {
  const { data: checkIns, isPending, error } = useCheckIns();
  const todayCheckIn = checkIns?.find((checkIn) => checkIn.date === today());

  return {
    todayCheckIn,
    checkedInToday: todayCheckIn !== undefined,
    isPending,
    error,
  };
}
