declare class LogServiceSDK {
  constructor(config?: {
    baseUrl?: string;
    endpoint?: string;
    timeout?: number;
  });

  logData(requestId: string, data: string | object): Promise<boolean>;
}

export = LogServiceSDK;
