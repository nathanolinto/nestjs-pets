import { Test, TestingModule } from '@nestjs/testing';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';
import { CreateCatInput } from './dto/create-cat.input';

const catServiceMock = {
  create: jest.fn((createCatInput: CreateCatInput) => ({
    id: 10,
    ...createCatInput,
  })),
  findAll: jest.fn(() => [
    {
      age: 3,
      name: 'Ventus',
      breed: 'Russian Blue',
      id: 1,
    },
  ]),
  findOne: jest.fn((id: number) => ({
    age: 3,
    name: 'Test Cat',
    breed: 'Test Breed',
    id,
  })),
};

describe('CatResolver', () => {
  let resolver: CatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatResolver,
        { provide: CatService, useValue: catServiceMock },
      ],
    }).compile();

    resolver = module.get<CatResolver>(CatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCat', () => {
    it('should make a new cat', () => {
      expect(
        resolver.createCat({
          name: 'Bad Cat',
          breed: 'Sphinx',
          age: 1390,
        }),
      ).toEqual({
        name: 'Bad Cat',
        breed: 'Sphinx',
        age: 1390,
        id: 10,
      });
    });
  });

  describe('getCats', () => {
    it('should get the cats array', () => {
      expect(resolver.getCats()).toEqual([
        {
          age: 3,
          name: 'Ventus',
          breed: 'Russian Blue',
          id: 1,
        },
      ]);
    });
  });

  describe('getCat', () => {
    it('should get one cat', () => {
      expect(resolver.getCat(500)).toEqual({
        name: 'Test Cat',
        breed: 'Test Breed',
        age: 3,
        id: 500,
      });
    });
  });
});
