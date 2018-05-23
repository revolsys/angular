
export class Config {
  public title: string;

  public basePath = '';

  public getUrl(path: string): string {
    return window.location.protocol + '//' + window.location.host + this.basePath + path;
  }
}
