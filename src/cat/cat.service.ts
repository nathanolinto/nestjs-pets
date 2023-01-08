import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCatInput } from './dto/create-cat.input';
import { UpdateCatInput } from './dto/update-cat.input';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatService {
  private cats: Cat[] = [
    {
      name: 'Ventus',
      age: 4,
      breed: 'Russian Blue',
      id: 1,
    },
    {
      name: 'Terra',
      age: 5,
      breed: 'Siberian',
      id: 2,
    },
    {
      name: 'Aqua',
      age: 3,
      breed: 'Maine Coon',
      id: 3,
    },
  ];

  create(createCatInput: CreateCatInput): Cat {
    const id = this.cats.length + 1;
    this.cats.push({ id, ...createCatInput });
    return this.cats[id - 1];
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(id: number): Cat {
    const foundCat = this.cats.find((cat) => cat.id === id);
    if (!foundCat) {
      throw new BadRequestException(`No cat with id ${id} found`);
    }
    return foundCat;
  }

  update(id: number, updateCatInput: UpdateCatInput): Cat {
    const findIndex = this.cats.findIndex((cat) => cat.id === id);
    if (findIndex < 0) {
      throw new BadRequestException(`No cat with id ${id} found`);
    }
    this.cats[findIndex] = updateCatInput;
    return this.cats[findIndex];
  }

  remove(id: number): number {
    const findIndex = this.cats.findIndex((cat) => cat.id === id);
    if (findIndex < 0) {
      throw new BadRequestException(`No cat with id ${id} found`);
    }
    const removedPet = this.cats.splice(findIndex, 1);
    return removedPet.length;
  }
}
