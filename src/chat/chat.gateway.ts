import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { ChatService } from './chat.service';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsGuard } from './gateway.guard';
import { MetadataService } from 'src/metadata/metadata.service';

@WebSocketGateway()
export class ChatGateway implements NestGateway {
  constructor(
    private chatService: ChatService,
    private logger: Logger,
    private metadataService: MetadataService,
  ) {}
  afterInit(server: any) {
    console.log('Init');
  }
  async handleConnection(socket: any) {
    socket.broadcast.emit('user', {
      id: socket.id,
      uId: socket.handshake.query.senderId,
    });
    await this.metadataService.updateWsId(
      socket.handshake.query.senderId,
      socket.id,
      true,
    );
    this.logger.log(`Connected Client ${socket.id}`);
  }
  async handleDisconnect(socket: any) {
    await this.metadataService.updateWsId(
      socket.handshake.query.senderId,
      'null',
      false,
    );
    this.logger.log(`Disconnected Client ${socket.id}`);
  }
  //one-on-one chat
  @UseGuards(WsGuard)
  @SubscribeMessage('chat')
  async handleNewMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query;
    const rId = query.receipentId;
    const sId = query.senderId;
    this.logger.log(
      `new message :: sender: ${sId} recipient: ${rId} message: ${data}`,
    );
    const fetchData = await this.metadataService.fetchWsId(rId);
    const wsId = fetchData.data.wsId;
    //emit chat to recipients
    if (wsId !== 'null') {
      client.broadcast.to(wsId).emit('reply', data);
      this.logger.log(
        `message succesfully recieved by client ${rId} or ${wsId}`,
      );
    }
    //save chat in db
    await this.chatService.saveChat(rId, sId, data);
  }
  //group chat
  @UseGuards(WsGuard)
  @SubscribeMessage('group')
  async handleGroupMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    //
    const query = client.handshake.query;
    const gId = query.gId;
    const uId = query.uId;
    const fetchWsId = await this.metadataService.fetchWsIds(gId, uId);
    //broadcast to all group users
    client.broadcast.to(fetchWsId).emit('groupReply', data);
    this.logger.log(`message succesfully recieved by clients ${fetchWsId}`);
    //save chat in db
    await this.chatService.saveGroupChat(gId, uId, data);
  }
}
