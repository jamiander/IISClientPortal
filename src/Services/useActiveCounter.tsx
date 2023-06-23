import { useMemo } from "react";

export function useActiveCounter<T>(list: T[], filterFunc: (list: T[], activeStatus: string) => T[])
{
  const {allCount, activeCount, inactiveCount} = useMemo(() => {
    const activeItemCount = filterFunc(list,"active").length;

    return {allCount: list.length, activeCount: activeItemCount, inactiveCount: list.length - activeItemCount};
  },[list]);

  return {allCount, activeCount, inactiveCount}
}
