import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'response_message';
export const RESPONSE_STATUS = 'response_status';

export const ResponseMetadata = (status: number, message: string) => {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    SetMetadata(RESPONSE_STATUS, status)(target, key, descriptor);
    SetMetadata(RESPONSE_MESSAGE, message)(target, key, descriptor);
  };
};
