import { useCallback, useState } from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(async <TResponse,>(url: string, method: string, body: unknown | undefined = undefined, headers = {'Content-Type': 'application/json'}) => {
        setLoading(true);

        try {
            const response = await fetch(url, {
                method,
                body: body ? JSON.stringify(body) : undefined,
                headers
            });

            if (!response.ok) {
                throw new Error(`Could not fetch resource ${url}, status ${response.status}`);
            }

            const data: TResponse = await response.json();

            setLoading(false)
            return data;
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Something went wrong, please refresh the page and try again';

            setLoading(false);
            setError(message);
            throw e;
        }
    }, [])

    return { loading, request, error };
}
