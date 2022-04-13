import { Injectable } from "@nestjs/common"
import { v4 as uuid } from "uuid"

@Injectable()
export class HelloService {
  db: { id: string, message: string }[] = []

  async findById(id: string) {
    return this.db.find(hello => hello.id === id)
  }

  async create(message: string) {
    const id = uuid()
    const hello = { id, message }
    this.db.push(hello)
    return hello;
  }

  async deleteById(id: string) {
    this.db = this.db.filter(hello => hello.id !== id)
    return `DELETED node ${id} from db`
  }
}