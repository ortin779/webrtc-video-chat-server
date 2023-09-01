import cors from '@fastify/cors';
import fastify, { FastifyInstance } from 'fastify';
import fastifySocketIo from 'fastify-socket.io';
import { appConfig } from './config/appConfig';

export const setupApp = (): FastifyInstance => {
  const app = fastify({ logger: true });

  app.register(cors, { origin: appConfig.corsOrigin });

  app.register(fastifySocketIo);

  app.after((err) => {
    if (err) {
      app.log.error('Error while registering socket io');
    }
    app.io.on('connection', (socket) => {
      socket.on('end-call', (roomId) => {
        socket.to(roomId).emit('user-exit');
      });

      socket.on('create-room', ({ roomId }) => {
        socket.join(roomId);
        socket.emit('created-room', { roomId });
      });

      socket.on('join-room', ({ roomId }) => {
        socket.join(roomId);
        socket.emit('joined-room', { roomId });
      });

      socket.on(
        'offer',
        (roomId: string, localDescription: RTCSessionDescription) => {
          socket.to(roomId).emit('offer', localDescription);
        }
      );

      socket.on(
        'answer',
        (roomId: string, answerData: RTCSessionDescription) => {
          socket.to(roomId).emit('answer', answerData);
        }
      );

      socket.on(
        'iceCandidate',
        (roomId: string, candidateData: RTCIceCandidateInit) => {
          socket.to(roomId).emit('iceCandidate', candidateData);
        }
      );
    });
  });

  app.get('/', (_, reply) => {
    reply.send({ message: 'Hello world' });
  });

  return app;
};
