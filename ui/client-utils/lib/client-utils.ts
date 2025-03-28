import { Platform } from 'react-native';

interface FetchRequest {
    method: string;
    url: string;
    body?: unknown | null;
    requiresAccessToken: boolean;
    headers?: { [key: string]: string };
}

interface RequestOptions {
    method: string;
    headers: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

let fetchWrapperContext = 'none';
export const setFetchWrapperContext = async (context: string) => {
    fetchWrapperContext = context;
};

// Wrapper function for all fetch calls. Grabs accessToken in local storage.
// If not set, it will set it in storage and then call the fetch.
// If is already set, it will call the fetch. If the response comes back with
// accessToken expired, it will automatically reauthenticate and set the new accessToken
// in LS and then call the fetch again
export const fetchWrapper = async (options: FetchRequest, retries = 0): Promise<any> => {
    try {
        const requestOptions: RequestOptions = {
            method: options.method,
            headers: {
                apiContext: fetchWrapperContext,
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                ...options.headers,
            },
        };

        // If body is specified, options body should be stringified
        if (options.body !== null) {
            requestOptions['body'] = JSON.stringify(options.body);
        }

        console.log('Request inputs', options.url, requestOptions)

        // Perform the REST call
        const resp = await fetch(options.url, requestOptions);

        const respJson = await resp.json();
        console.log('Response:', {
            status: resp.status,
            url: options.url,
            json: respJson,
        });


        // Handle other errors
        if (resp.status >= 400) {
            throw new Error(respJson.message || 'Request failed');
        }

        // Return back the response json
        return respJson;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
