import {Injectable} from '@angular/core';

@Injectable()
export default class HelperFunctions {

  constructor() {
  }

  public awaitTime(time: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        return resolve(true);
      }, time);
    });
  }

  public stringPadding(string: string | number, pad: string, length: number): string {
    return ( new Array(length + 1).join(pad) + string.toString() ).slice(-length);
  }

}
