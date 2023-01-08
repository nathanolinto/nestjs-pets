import { Module } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatResolver } from './cat.resolver';

@Module({
  providers: [CatResolver, CatService],
})
export class CatModule {}
