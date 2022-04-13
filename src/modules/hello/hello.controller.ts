import { Controller, Logger, Get, Post, Body, NotFoundException, Param } from "@nestjs/common";
import { IsDefined, IsNotEmpty } from "class-validator";
import { v4 as uuid } from "uuid"

import { HelloService } from './hello.service';

class HelloBody {
  @IsDefined()
  @IsNotEmpty({ message: 'A custom error message' }) message!: string
}

@Controller()
export class HelloController {
  logger: Logger = new Logger(HelloController.name);

  constructor(private readonly helloService: HelloService) { }

  @Get('hello')
  async replyHello() {
    try {
      return 'Hello';
    } catch (error) {
      this.logger.error(error?.message ?? '');
      throw error;
    }
  }

  @Get('hello/:helloId')
  async replyExactHello(
    @Param('helloId') id: string
  ) {
    try {
      const message = (await this.helloService.findById(id))?.message;
      if (!message) throw new NotFoundException("desired `hello` not found")
      return message;
    } catch (error) {
      this.logger.error(error?.message ?? "");
      throw error;
    }
  }

  @Post('hello')
  async saveHello(
    @Body() body: HelloBody
  ) {
    try {
      return await this.helloService.create(body.message)
    }
    catch (error) {
      this.logger.error(error?.message ?? "");
      throw error;
    }
  }
}
