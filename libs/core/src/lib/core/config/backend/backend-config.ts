export interface BackendConfig {
  production?: boolean;
  rest: {
    featureFlagsUrl: string;
    ordersUrl: string;
    invoicesUrl: string;
    logsUrl?: string;
    wsUrl?: string;
    prefix?: string;
    /**
     * Indicates whether or not cross-site Access-Control requests should be made
     * using credentials such as cookies, authorization headers or TLS client certificates
     */
    useWithCredentials?: boolean;

    endpoints?: Record<string, string>;
    context?: SiteContextConfig;
  };
  media?: {
    /**
     * Media URLs are typically relative, so that the host can be configured.
     * Configurable media baseURLs are useful for SEO, multi-site,
     * switching environments, etc.
     */
    baseUrl?: string;
  };
  //featureFlags?: FeatureFlag;
}

export interface SiteContextConfig {
  urlParameters?: string[];
  [contextName: string]: string[] | undefined;
}
