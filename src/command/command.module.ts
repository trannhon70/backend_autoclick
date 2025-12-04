import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from 'src/history/entities/history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([History]),
  ],
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule { }
