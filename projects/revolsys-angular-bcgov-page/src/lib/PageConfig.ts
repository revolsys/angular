import {MenuItem} from './MenuItem';
import {SecurityService} from './security.service';

export class PageConfig {
  basePath = '';

  title: string;

  headerMenuItems?: Array<MenuItem>;

  securityService?: SecurityService;

  fullWidthContent?: boolean = false;
}
