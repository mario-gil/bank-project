import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://jsamper92_db_user:m1rwH8iBIety47qv@test.bbbmufj.mongodb.net/banca_db?retryWrites=true&w=majority&appName=test',
    ),
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

