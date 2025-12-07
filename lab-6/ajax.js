class Ajax {
    constructor(options = {}) {
        this.defaults = {
            baseURL: '',
            headers: {},
            timeout: 5000,
            ...options,
        };
    }

    async get(url, options = {}) {
        return this._request(url, { method: 'GET', ...options });
    }

    async post(url, data, options = {}) {
        return this._request(url, { method: 'POST', body: data, ...options });
    }

    async put(url, data, options = {}) {
        return this._request(url, { method: 'PUT', body: data, ...options });
    }

    async delete(url, options = {}) {
        return this._request(url, { method: 'DELETE', ...options });
    }

    async _request(url, options = {}) {
        const config = this._mergeOptions(options);
        const fullUrl = config.baseURL + url;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        try {
            const response = await fetch(fullUrl, {
                method: config.method,
                headers: config.headers,
                body: config.body ? JSON.stringify(config.body) : undefined,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let friendly = '';

                if (response.status === 404) {
                    friendly =
                        'Zasób nie został znaleziony (404). Sprawdź URL lub ID.';
                } else if (response.status >= 500) {
                    friendly =
                        'Błąd po stronie serwera. Spróbuj ponownie później.';
                } else {
                    friendly = `Błąd HTTP ${response.status}.`;
                }

                throw new Error(friendly);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(
                    `Request timeout: ${config.timeout}ms exceeded`
                );
            }
            throw error;
        }
    }

    _mergeOptions(options) {
        return {
            method: 'GET',
            ...this.defaults,
            headers: {
                'Content-Type': 'application/json',
                ...this.defaults.headers,
                ...options.headers,
            },
            ...options,
        };
    }
}

export default Ajax;
