
export class FrameworkConfig {
  public title?: string;

  public basePath ?= '';

  public useAuthService ?= true;

  public baseUrl ?= null;

  public static getUrl(config: FrameworkConfig, path: string): string {
    if (config.baseUrl) {
      return config.baseUrl + config.basePath + path;
    } else {
      return window.location.protocol + '//' + window.location.host + config.basePath + path;
    }
  }
}
