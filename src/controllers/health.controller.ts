import { omit } from 'lodash';
import { Controller, Get, Head, Query } from '@nestjs/common';
import { join } from 'path';
import {
  IStringTMap,
  IConfiguration,
} from '../commons/interfaces';
const pkg = require(join(process.cwd(), 'package.json'));

@Controller('')
export default class HealthController {
  private healthValue: (query: any) => any;
  constructor(
    private readonly config: IConfiguration
  ) {
    const defaultHealth = ['name', 'version'].reduce((acc: IStringTMap<any>, key: string) => {
      acc[key] = (<any>pkg)[key];
      return acc;
    }, {});

    const values: any = {
      pkginfo: pkg,
      config: omit(this.config.get(), ['type'])
    };

    this.healthValue = (query: any) =>
      Object.keys(query).reduce((acc, key: string) => ({ ...acc, [key]: values[key] }), defaultHealth);
  }

  @Get('/health')
  @Head('/health')
  show(
    @Query()
    query: any
  ) {
    return this.healthValue(query);
  }
}
