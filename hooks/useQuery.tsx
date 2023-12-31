import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const useQuery = () => {
    const search = useSearchParams();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default useQuery;
