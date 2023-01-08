import { Test, TestingModule } from '@nestjs/testing';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';

const catServiceMock = {
  create: jest.fn().mockReturnValue({
    name: 'Bad Cat',
    breed: 'Sphinx',
    age: 1390,
    id: 10,
  }),
  findAll: jest.fn().mockReturnValue([
    {
      age: 3,
      name: 'Ventus',
      breed: 'Russian Blue',
      id: 1,
    },
  ]),
  findOne: jest.fn().mockReturnValue({
    age: 3,
    name: 'Test Cat',
    breed: 'Test Breed',
    id: 1,
  }),
  update: jest
    .fn()
    .mockReturnValue({ name: 'Plutão', breed: 'Sphinx', age: 5, id: 1 }),
  remove: jest.fn().mockReturnValue(1),
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
      expect(resolver.getCat(1)).toEqual({
        age: 3,
        name: 'Test Cat',
        breed: 'Test Breed',
        id: 1,
      });
    });
  });

  describe('updateCat', () => {
    it('should update a cat', () => {
      expect(
        resolver.updateCat({
          name: 'Plutão',
          breed: 'Sphinx',
          age: 5,
          id: 1,
        }),
      ).toEqual({
        name: 'Plutão',
        breed: 'Sphinx',
        age: 5,
        id: 1,
      });
    });
  });

  describe('removeCat', () => {
    it('should remove a cat', () => {
      expect(resolver.removeCat(1)).toBe(1);
    });
  });
});
