import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCatInput {
  @Field(() => Int)
  age: number;

  @Field()
  name: string;

  @Field()
  breed: string;
}
