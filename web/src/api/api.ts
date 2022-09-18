/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * ID
 * @format uuid
 * @example d290f1ee-6c54-4b01-90e6-d701748f0851
 */
export type Id = string;

/**
 * Email
 * @format email
 * @example example@example.com
 */
export type Email = string;

/**
 * * Must be at least 8 characters long
 * Must be at most 200 characters long
 * @example password
 */
export type Password = string;

export interface UserForMe {
  /** ID */
  id: Id;

  /** Email */
  email: Email;
}

export interface LoginRequest {
  /** Email */
  email: Email;

  /**
   * * Must be at least 8 characters long
   * * Must be at most 200 characters long
   *
   */
  password: Password;
}

export interface ConfirmEmailToCreateUserRequest {
  /** Email */
  email: Email;
}

export interface SignUpRequest {
  /**
   * * Must be at least 8 characters long
   * * Must be at most 200 characters long
   *
   */
  password: Password;
}

export namespace Hello {
  /**
   * @description Get Hello World
   * @name GetHelloWorld
   * @summary Get Hello World
   * @request GET:/hello
   * @secure
   * @response `200` `Id` Successful operation
   */
  export namespace GetHelloWorld {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = { "X-Requested-With": string };
    export type ResponseBody = Id;
  }
}

export namespace Login {
  /**
   * @description Login
   * @tags authentication
   * @name Login
   * @summary Login
   * @request POST:/login
   * @secure
   * @response `201` `UserForMe` Successful operation
   * @response `400` `any`
   * @response `401` `any`
   */
  export namespace Login {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginRequest;
    export type RequestHeaders = { "X-Requested-With": string };
    export type ResponseBody = UserForMe;
  }
}

export namespace Logout {
  /**
   * @description disable cookie to logout
   * @tags authentication
   * @name Logout
   * @summary Logout
   * @request POST:/logout
   * @secure
   * @response `201` `void` Successful operation
   * @response `401` `any`
   */
  export namespace Logout {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = { "X-Requested-With": string };
    export type ResponseBody = void;
  }
}

export namespace Users {
  /**
   * @description Confirm email to Create User * Api sends an email to the user with a link to confirm the email address. * if already registerd, successful response is returned too.
   * @tags users
   * @name ConfirmEmailToCreateUser
   * @summary Confirm email to Create User
   * @request POST:/users
   * @secure
   * @response `201` `void` Always returns success if the format of the emaill address is correct
   * @response `400` `any`
   */
  export namespace ConfirmEmailToCreateUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConfirmEmailToCreateUserRequest;
    export type RequestHeaders = { "X-Requested-With": string };
    export type ResponseBody = void;
  }
  /**
   * @description Get my user
   * @tags users
   * @name GetMyUser
   * @summary Get my user
   * @request GET:/users/me
   * @secure
   * @response `200` `UserForMe` Successful operation
   * @response `401` `any`
   */
  export namespace GetMyUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = { "X-Requested-With": string };
    export type ResponseBody = UserForMe;
  }
  /**
   * @description Sign up
   * @tags users
   * @name SignUp
   * @summary Sign up
   * @request POST:/users/{userId}
   * @secure
   * @response `201` `UserForMe` successful operation
   * @response `400` `any`
   */
  export namespace SignUp {
    export type RequestParams = { userId: Id };
    export type RequestQuery = {};
    export type RequestBody = SignUpRequest;
    export type RequestHeaders = { "X-Requested-With": string };
    export type ResponseBody = UserForMe;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "https://api.localhost.r253hmdryou.dev/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
        ...(requestParams.headers || {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title todo-api
 * @version 1.0.0
 * @baseUrl https://api.localhost.r253hmdryou.dev/v1
 *
 * API for TODO app
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  hello = {
    /**
     * @description Get Hello World
     *
     * @name GetHelloWorld
     * @summary Get Hello World
     * @request GET:/hello
     * @secure
     * @response `200` `Id` Successful operation
     */
    getHelloWorld: (params: RequestParams = {}) =>
      this.request<Id, any>({
        path: `/hello`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description Login
     *
     * @tags authentication
     * @name Login
     * @summary Login
     * @request POST:/login
     * @secure
     * @response `201` `UserForMe` Successful operation
     * @response `400` `any`
     * @response `401` `any`
     */
    login: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<UserForMe, any>({
        path: `/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * @description disable cookie to logout
     *
     * @tags authentication
     * @name Logout
     * @summary Logout
     * @request POST:/logout
     * @secure
     * @response `201` `void` Successful operation
     * @response `401` `any`
     */
    logout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * @description Confirm email to Create User * Api sends an email to the user with a link to confirm the email address. * if already registerd, successful response is returned too.
     *
     * @tags users
     * @name ConfirmEmailToCreateUser
     * @summary Confirm email to Create User
     * @request POST:/users
     * @secure
     * @response `201` `void` Always returns success if the format of the emaill address is correct
     * @response `400` `any`
     */
    confirmEmailToCreateUser: (data: ConfirmEmailToCreateUserRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Get my user
     *
     * @tags users
     * @name GetMyUser
     * @summary Get my user
     * @request GET:/users/me
     * @secure
     * @response `200` `UserForMe` Successful operation
     * @response `401` `any`
     */
    getMyUser: (params: RequestParams = {}) =>
      this.request<UserForMe, any>({
        path: `/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Sign up
     *
     * @tags users
     * @name SignUp
     * @summary Sign up
     * @request POST:/users/{userId}
     * @secure
     * @response `201` `UserForMe` successful operation
     * @response `400` `any`
     */
    signUp: (userId: Id, data: SignUpRequest, params: RequestParams = {}) =>
      this.request<UserForMe, any>({
        path: `/users/${userId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
