import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiStandardResponse<
  TModel extends Type<any> | Record<string, any>,
>(modelOrSchema: TModel, status = 200) {
  const isClass = typeof modelOrSchema === 'function';

  const decorators = [
    ApiResponse({
      status,
      schema: {
        type: 'object',
        properties: {
          status: { type: 'boolean' },
          message: { type: 'string' },
          data: isClass
            ? { $ref: getSchemaPath(modelOrSchema) }
            : modelOrSchema,
        },
      },
    }),
  ];

  if (isClass) {
    decorators.push(ApiExtraModels(modelOrSchema));
  }

  return applyDecorators(...decorators);
}
