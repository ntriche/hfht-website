import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logs: string[] = [];

  public text_colors: Record<string, string> = {
    'black': '\x1b[30m',
    'red': '\x1b[31m',
    'green': '\x1b[32m',
    'yellow': '\x1b[33m',
    'blue': '\x1b[34m',
    'magenta': '\x1b[35m',
    'cyan': '\x1b[36m',
    'white': '\x1b[37m',
    'crimson': '\x1b[38m'
  } 

  public bg_colors: Record<string, string> = {
    'black': '\x1b[40m',
    'red': '\x1b[41m',
    'green': '\x1b[42m',
    'yellow': '\x1b[43m',
    'blue': '\x1b[44m',
    'magenta': '\x1b[45m',
    'cyan': '\x1b[46m',
    'white': '\x1b[47m',
    'crimson': '\x1b[48m'
  }

  public modifiers: Record<string, string> = {
    'reset': '\x1b[0m',
    'bright': '\x1b[1m',
    'dim': '\x1b[2m',
    'underscore': '\x1b[4m',
    'blink': '\x1b[5m',
    'reverse': '\x1b[7m',
    'hidden': '\x1b[8m',
  }
  
  write(msg: string) {
    let dateTime = new Date();
    msg = '[' + dateTime + 'INF]' + msg;
    this.logs.push(msg);
    console.log(msg);
  }

  succ(msg: string) {
    let dateTime = new Date();
    msg = '[' + dateTime + 'INF]' + msg;
    this.logs.push(msg);
    console.log(this.text_colors['green'], msg)
  }

  error(msg: string) {
    let dateTime = new Date();
    msg = '[' + dateTime + 'ERR]' + msg;
    this.logs.push(msg);
    console.log(this.text_colors['red'], msg)
  }
}
