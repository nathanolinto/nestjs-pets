import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Cat {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  age: number;

  @Field()
  name: string;

  @Field()
  breed: string;
}
