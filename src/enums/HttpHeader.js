/**
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
 */
const HttpHeader = {
    /**
     * Authentication
     */
    WWW_AUTHENTICATE: 'WWW-Authenticate',
    AUTHORIZATION: 'Authorization',
    PROXY_AUTHENTICATE: 'Proxy-Authenticate',
    PROXY_AUTHORIZATION: 'Proxy-Authorization',

    /**
     * Caching
     */
    AGE: 'Age',
    CACHE_CONTROL: 'Cache-Control',
    CLEAR_SITE_DATA: 'Clear-Site-Data',
    EXPIRES: 'Expires',
    PRAGMA: 'Pragma',
    WARNING: 'Warning',

    /**
     * Client hints
     */
    ACCEPT_CH_LIFETIME: 'Accept-CH-Lifetime',
    ACCEPT_CH: 'Accept-CH',
    /**
     * User agent client hints
     */
    SEC_CH_UA: 'Sec-CH-UA',
    SEC_CH_UA_ARCH: 'Sec-CH-UA-Arch',
    SEC_CH_UA_BITNESS: 'Sec-CH-UA-Bitness',
    SEC_CH_UA_FULL_VERSION: 'Sec-CH-UA-Full-Version',
    SEC_CH_UA_FULL_VERSION_LIST: 'Sec-CH-UA-Full-Version-List',
    SEC_CH_UA_MOBILE: 'Sec-CH-UA-Mobile',
    SEC_CH_UA_MODEL: 'Sec-CH-UA-Model',
    SEC_CH_UA_PLATFORM: 'Sec-CH-UA-Platform',
    SEC_CH_UA_PLATFORM_VERSION: 'Sec-CH-UA-Platform-Version',
    /**
     * Device client hints
     */
    CONTENT_DPR: 'Content-DPR',
    DEVICE_MEMORY: 'Device-Memory',
    DPR: 'DPR',
    VIEWPORT_WIDTH: 'Viewport-Width',
    WIDTH: 'Width',
    /**
     * Network client hints
     */
    DOWNLINK: 'Downlink',
    ECT: 'ECT',
    RTT: 'RTT',
    SAVE_DATA: 'Save-Data',

    /**
     * Conditionals
     */
    LAST_MODIFIED: 'Last-Modified',
    ETAG: 'ETag',
    IF_MATCH: 'If-Match',
    IF_NONE_MATCH: 'If-None-Match',
    IF_MODIFIED_SINCE: 'If-Modified-Since',
    IF_UNMODIFIED_SINCE: 'If-Unmodified-Since',
    VARY: 'Vary',

    /**
     * Connection management
     */
    CONNECTION: 'Connection',
    KEEP_ALIVE: 'Keep-Alive',

    /**
     * Content negotiation
     */
    ACCEPT: 'Accept',
    ACCEPT_ENCODING: 'Accept-Encoding',
    ACCEPT_LANGUAGE: 'Accept-Language',

    /**
     * Controls
     */
    EXPECT: 'Expect',
    MAX_FORWARDS: 'Max-Forwards',

    /**
     * Cookies
     */
    COOKIE: 'Cookie',
    SET_COOKIE: 'Set-Cookie',

    /**
     * CORS
     */
    ACCESS_CONTROL_ALLOW_ORIGIN: 'Access-Control-Allow-Origin',
    ACCESS_CONTROL_ALLOW_CREDENTIALS: 'Access-Control-Allow-Credentials',
    ACCESS_CONTROL_ALLOW_HEADERS: 'Access-Control-Allow-Headers',
    ACCESS_CONTROL_ALLOW_METHODS: 'Access-Control-Allow-Methods',
    ACCESS_CONTROL_EXPOSE_HEADERS: 'Access-Control-Expose-Headers',
    ACCESS_CONTROL_MAX_AGE: 'Access-Control-Max-Age',
    ACCESS_CONTROL_REQUEST_HEADERS: 'Access-Control-Request-Headers',
    ACCESS_CONTROL_REQUEST_METHOD: 'Access-Control-Request-Method',
    ORIGIN: 'Origin',
    TIMING_ALLOW_ORIGIN: 'Timing-Allow-Origin',

    /**
     * Downloads
     */
    CONTENT_DISPOSITION: 'Content-Disposition',

    /**
     * Message body information
     */
    CONTENT_LENGTH: 'Content-Length',
    CONTENT_TYPE: 'Content-Type',
    CONTENT_ENCODING: 'Content-Encoding',
    CONTENT_LANGUAGE: 'Content-Language',
    CONTENT_LOCATION: 'Content-Location',

    /**
     * Proxies
     */
    FORWARDED: 'Forwarded',
    X_FORWARDED_FOR: 'X-Forwarded-For',
    X_FORWARDED_HOST: 'X-Forwarded-Host',
    X_FORWARDED_PROTO: 'X-Forwarded-Proto',
    VIA: 'Via',

    /**
     * Redirects
     */
    LOCATION: 'Location',

    /**
     * Request context
     */
    FROM: 'From',
    HOST: 'Host',
    REFERER: 'Referer',
    REFERRER_POLICY: 'Referrer-Policy',
    USER_AGENT: 'User-Agent',

    /**
     * Response context
     */
    ALLOW: 'Allow',
    SERVER: 'Server',

    /**
     * Range requests
     */
    ACCEPT_RANGES: 'Accept-Ranges',
    RANGE: 'Range',
    IF_RANGE: 'If-Range',
    CONTENT_RANGE: 'Content-Range',

    /**
     * Security
     */
    CROSS_ORIGIN_EMBEDDER_POLICY: 'Cross-Origin-Embedder-Policy',
    CROSS_ORIGIN_OPENER_POLICY: 'Cross-Origin-Opener-Policy',
    CROSS_ORIGIN_RESOURCE_POLICY: 'Cross-Origin-Resource-Policy',
    CONTENT_SECURITY_POLICY: 'Content-Security-Policy',
    CONTENT_SECURITY_POLICY_REPORT_ONLY: 'Content-Security-Policy-Report-Only',
    EXPECT_CT: 'Expect-CT',
    FEATURE_POLICY: 'Feature-Policy',
    ORIGIN_ISOLATION: 'Origin-Isolation',
    STRICT_TRANSPORT_SECURITY: 'Strict-Transport-Security',
    UPGRADE_INSECURE_REQUESTS: 'Upgrade-Insecure-Requests',
    X_CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
    X_DOWNLOAD_OPTIONS: 'X-Download-Options',
    X_FRAME_OPTIONS: 'X-Frame-Options',
    X_PERMITTED_CROSS_DOMAIN_POLICIES: 'X-Permitted-Cross-Domain-Policies',
    X_POWERED_BY: 'X-Powered-By',
    X_XSS_PROTECTION: 'X-XSS-Protection',
    /**
     * Fetch metadata request headers
     */
    SEC_FETCH_SITE: 'Sec-Fetch-Site',
    SEC_FETCH_MODE: 'Sec-Fetch-Mode',
    SEC_FETCH_USER: 'Sec-Fetch-User',
    SEC_FETCH_DEST: 'Sec-Fetch-Dest',
    SERVICE_WORKER_NAVIGATION_PRELOAD: 'Service-Worker-Navigation-Preload',

    /**
     * Server-sent events
     */
    LAST_EVENT_ID: 'Last-Event-ID',
    NEL: 'NEL',
    PING_FROM: 'Ping-From',
    PING_TO: 'Ping-To',
    REPORT_TO: 'Report-To',

    /**
     * Transfer coding
     */
    TRANSFER_ENCODING: 'Transfer-Encoding',
    TE: 'TE',
    TRAILER: 'Trailer',

    /**
     * WebSockets
     */
    SEC_WEB_SOCKET_KEY: 'Sec-WebSocket-Key',
    SEC_WEB_SOCKET_EXTENSIONS: 'Sec-WebSocket-Extensions',
    SEC_WEB_SOCKET_ACCEPT: 'Sec-WebSocket-Accept',
    SEC_WEB_SOCKET_PROTOCOL: 'Sec-WebSocket-Protocol',
    SEC_WEB_SOCKET_VERSION: 'Sec-WebSocket-Version',

    /**
     * Other
     */
    ACCEPT_PUSH_POLICY: 'Accept-Push-Policy',
    ACCEPT_SIGNATURE: 'Accept-Signature',
    ALT_SVC: 'Alt-Svc',
    DATE: 'Date',
    EARLY_DATA: 'Early-Data',
    LARGE_ALLOCATION: 'Large-Allocation',
    LINK: 'Link',
    PUSH_POLICY: 'Push-Policy',
    RETRY_AFTER: 'Retry-After',
    SIGNATURE: 'Signature',
    SIGNED_HEADERS: 'Signed-Headers',
    SERVER_TIMING: 'Server-Timing',
    SERVICE_WORKER_ALLOWED: 'Service-Worker-Allowed',
    SOURCE_MAP: 'SourceMap',
    UPGRADE: 'Upgrade',
    X_DNS_PREFETCH_CONTROL: 'X-DNS-Prefetch-Control',
    X_FIREFOX_SPDY: 'X-Firefox-Spdy',
    X_PINGBACK: 'X-Pingback',
    X_REQUESTED_WITH: 'X-Requested-With',
    X_ROBOTS_TAG: 'X-Robots-Tag',
    X_UA_COMPATIBLE: 'X-UA-Compatible'
};

export default Object.freeze(HttpHeader);
