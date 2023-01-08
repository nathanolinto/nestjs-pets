import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CatService } from './cat.service';

describe('CatService', () => {
  let service: CatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatService],
    }).compile();

    service = module.get<CatService>(CatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should add a cat to the array', () => {
      const createCatData = {
        name: 'Garfield',
        age: 17,
        breed: 'Tabby',
      };
      const createdCat = service.create(createCatData);
      expect(createdCat).toEqual({
        id: 4,
        ...createCatData,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of cats', () => {
      const cats = service.findAll();
      expect(cats).toEqual([
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
      ]);
    });
  });

  describe('findOne', () => {
    it('should successfully return a cat', () => {
      const cat = service.findOne(2);
      expect(cat).toEqual({
        name: 'Terra',
        age: 5,
        breed: 'Siberian',
        id: 2,
      });
    });
    it('should throw an error', () => {
      const noIdCall = () => service.findOne(410);
      expect(noIdCall).toThrowError(BadRequestException);
      expect(noIdCall).toThrowError('No cat with id 410 found');
    });
  });

  describe('update', () => {
    it('should update a cat to the array', () => {
      const updateCatData = {
        name: 'Plutão',
        age: 10,
        breed: 'Russian Red',
        id: 1,
      };
      const updatedCat = service.update(updateCatData.id, updateCatData);
      expect(updatedCat).toEqual({
        ...updateCatData,
      });
    });
    it('should throw an error', () => {
      const noIdCall = () => service.findOne(410);
      expect(noIdCall).toThrowError(BadRequestException);
      expect(noIdCall).toThrowError('No cat with id 410 found');
    });
  });

  describe('remove', () => {
    it('should remove a cat to the array', () => {
      const createdCat = service.remove(1);
      expect(createdCat).toEqual(1);
    });
    it('should throw an error', () => {
      const noIdCall = () => service.findOne(410);
      expect(noIdCall).toThrowError(BadRequestException);
      expect(noIdCall).toThrowError('No cat with id 410 found');
    });
  });
});
