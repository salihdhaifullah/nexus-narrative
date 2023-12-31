import { useState, useCallback, DependencyList } from 'react';

interface IResult<T> {
    ok: boolean;
    body?: T
    message?: string
}

interface IPayload<T> {
    isLoading: boolean;
    result: T | null;
    ok: boolean;
    message: string | null;
}

export default function useFetchApi<R = undefined, B = undefined>
    (method: "POST" | "PATCH" | "GET" | "DELETE",
        url: string, deps: DependencyList = [],
        callback?: (arg: R) => void): [payload: IPayload<R>, call: (body?: B) => void] {

    const [result, setResult] = useState<R | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [ok, setOk] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(false);

    const init = useCallback(async (body?: B) => {
        setIsLoading(true);

        try {
            const responseBlob = await fetch(`${window.origin}/api/${url}`,
                {
                    method: method,
                    body: body ? JSON.stringify(body) : undefined,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

            const response = await responseBlob.json() as IResult<R>;

            setOk(response.ok)

            if (response?.message) {
                setMessage(response.message)
            }
            if (response?.body) {
                setResult(response.body);
            }

            callback && callback(response.body as R);

        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);


    return [{ isLoading, result, message, ok }, init];
}
