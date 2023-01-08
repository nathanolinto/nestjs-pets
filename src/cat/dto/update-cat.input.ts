import { CreateCatInput } from './create-cat.input';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCatInput extends CreateCatInput {
  @Field(() => Int)
  id: number;
}
