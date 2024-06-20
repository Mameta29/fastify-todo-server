// server/_wrapper.ts
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export class FastifyWrapper {
  private server: FastifyInstance;

  constructor() {
    this.server = Fastify();
  }

  public get(url: string, handler: (request: FastifyRequest, reply: FastifyReply) => void): void {
    this.server.get(url, handler);
  }

  public post(url: string, handler: (request: FastifyRequest, reply: FastifyReply) => void): void {
    this.server.post(url, handler);
  }

  public put(url: string, handler: (request: FastifyRequest, reply: FastifyReply) => void): void {
    this.server.put(url, handler);
  }

  public patch(url: string, handler: (request: FastifyRequest, reply: FastifyReply) => void): void {
    this.server.patch(url, handler);
  }

  public delete(url: string, handler: (request: FastifyRequest, reply: FastifyReply) => void): void {
    this.server.delete(url, handler);
  }

  public run(port: number): void {
    this.server.listen({ port }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is running at ${address}`);
    });
  }
}