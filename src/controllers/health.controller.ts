import { Controller, Get, Head } from '@nestjs/common';
import { join } from 'path';
import { IStringTMap } from '../commons/interfaces';
const pkg = require(join(process.cwd(), 'package.json'));

@Controller('')
export default class HealthController {
  @Get('/health')
  @Head('/health')
  show() {
    const healthInfo = ['name', 'version'].reduce((acc: IStringTMap<any>, key: string) => {
      acc[key] = (<any>pkg)[key];
      return acc;
    }, {});
    return healthInfo;
  }
}
