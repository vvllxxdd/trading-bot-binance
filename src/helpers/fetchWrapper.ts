import { Config } from "../config";

const apiKey = Config.binance_key;

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
}

export enum ContentType {
  JSON = "application/json",
  FORM_URL_ENCODED = "application/x-www-form-urlencoded",
}

export type HeadersType = { [key: string]: string };

export type RequestConfig = {
  method: RequestMethod;
  accessToken?: string | null;
  headers?: HeadersType;
};

const getFormattedResponse = (
  response: Response
): Promise<Record<string, any>> | any | undefined => {
  const formattedContentTypeHeader = response.headers
    .get("content-type")
    ?.split(";")[0];

  switch (formattedContentTypeHeader) {
    case ContentType.JSON:
      return response.json();
  }
};

export const fetchWrapper = async <T = unknown>(
  url: string,
  {
    method = RequestMethod.GET,
    headers = {
      "X-MBX-APIKEY": apiKey!,
      "Content-Type": "application/json",
    },
  }: Partial<RequestConfig> = {}
): Promise<T> => {
  const config = {
    method,
    headers,
  };

  const response = await fetch(url, config);

  if (response.ok) {
    return getFormattedResponse(response as Response);
  } else {
    throw await getFormattedResponse(response as Response);
  }
};
