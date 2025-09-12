import { NextFunction, Request, Response } from 'express';

type AsyncMethod = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export class BaseController {
  constructor() {
    this.autoWrapAsyncMethods();
  }

  private autoWrapAsyncMethods() {
    const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

    for (const name of methodNames) {
      const method = (this as any)[name];

      if (typeof method === 'function' && name !== 'constructor') {
        (this as any)[name] = this.wrapAsync(method);
      }
    }
  }

  private wrapAsync(fn: AsyncMethod): AsyncMethod {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await fn.call(this, req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
}
