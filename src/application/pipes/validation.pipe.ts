import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException, ValidationException } from 'exceptions';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    const errors = await validate(object);

    if (errors.length > 0) {
      throw new ValidationException(
        this.buildError(errors),
        'Input data validation failed'
      );
    }

    return value;
  }

  private buildError(errors): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    errors.forEach((el) => {
      const prop = el.property;

      if (el.constraints) {
        result[prop] = Object.values(el.constraints);
      }
    });

    return result;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
