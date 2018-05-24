
export class FrameworkConfig {
  public title?: string;

  public basePath?= '';

  public static getUrl(config: FrameworkConfig, path: string): string {
    return window.location.protocol + '//' + window.location.host + config.basePath + path;
  }
}
