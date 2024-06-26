import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyCookie from '@fastify/cookie';

export class FastifyWrapper {
  private server: FastifyInstance;

  constructor() {
    this.server = Fastify();
    this.server.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET || 'secretexample',
    });
  }

  middleware(path: string, httpMethodList: string[], callBack: any, args: any) {
    const regex = new RegExp(path);
    // prismaにlogIdを渡す前に実行する
    this.server.addHook("preValidation", async (request, reply) => {
      if (request.url.match(regex) && httpMethodList.includes(request.method)) {
        await callBack(request, reply, args);
      }
    });
  }

  public get(url: string, handler: (request: FastifyRequest<any>, reply: FastifyReply) => void): void {
    this.server.get(url, handler);
  }

  public post(url: string, handler: (request: FastifyRequest<any>, reply: FastifyReply) => void): void {
    this.server.post(url, handler);
  }

  public put(url: string, handler: (request: FastifyRequest<any>, reply: FastifyReply) => void): void {
    this.server.put(url, handler);
  }

  public patch(url: string, handler: (request: FastifyRequest<any>, reply: FastifyReply) => void): void {
    this.server.patch(url, handler);
  }

  public delete(url: string, handler: (request: FastifyRequest<any>, reply: FastifyReply) => void): void {
    this.server.delete(url, handler);
  }

  public run(port: number): void {
    this.server.listen({ port, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is running at ${address}`);
    });
  }
}