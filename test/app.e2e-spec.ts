import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Cat } from '../src/cat/entities/cat.entity';

const gql = '/graphql';

let cats: Cat[];

describe('GraphQL AppResolver (e2e) {Supertest}', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cats = [
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
  });

  describe(gql, () => {
    describe('cats', () => {
      it('should get the cats array', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({ query: '{getCats {id name age breed }}' })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.getCats).toEqual(cats);
          });
      });
      describe('one cat', () => {
        it('should get a single cat', () => {
          return request(app.getHttpServer())
            .post(gql)
            .send({ query: '{getCat(id:2){id name age breed}}' })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.getCat).toEqual({
                name: 'Terra',
                age: 5,
                breed: 'Siberian',
                id: 2,
              });
            });
        });
        it('should get an error for bad id', () => {
          return request(app.getHttpServer())
            .post(gql)
            .send({ query: '{getCat(id:500){id name age breed}}' })
            .expect(200)
            .expect((res) => {
              expect(res.body.data).toBe(null);
              expect(res.body.errors[0].message).toBe(
                'No cat with id 500 found',
              );
            });
        });
      });
      it('should create a new cat and have it added to the array', () => {
        return (
          request(app.getHttpServer())
            .post(gql)
            .send({
              query:
                'mutation {createCat(createCatInput: { name: "Vanitas", breed: "Calico", age: 100 }) {breed name id age}}',
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.createCat).toEqual({
                name: 'Vanitas',
                breed: 'Calico',
                age: 100,
                id: 4,
              });
            })
            // chain another request to see our original one works as expected
            .then(() =>
              request(app.getHttpServer())
                .post(gql)
                .send({ query: '{getCats {id name breed age}}' })
                .expect(200)
                .expect((res) => {
                  expect(res.body.data.getCats).toEqual(
                    cats.concat([
                      {
                        name: 'Vanitas',
                        breed: 'Calico',
                        age: 100,
                        id: 4,
                      },
                    ]),
                  );
                }),
            )
        );
      });
      it('should update a cat and have it added to the array', () => {
        return (
          request(app.getHttpServer())
            .post(gql)
            .send({
              query:
                'mutation {updateCat(updateCatInput: { id: 1, name: "Ventus", breed: "Russian Red", age: 100 }) {breed name id age}}',
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.updateCat).toEqual({
                name: 'Ventus',
                breed: 'Russian Red',
                age: 100,
                id: 1,
              });
            })
            // chain another request to see our original one works as expected
            .then(() =>
              request(app.getHttpServer())
                .post(gql)
                .send({ query: '{getCats {id name breed age}}' })
                .expect(200)
                .expect((res) => {
                  expect(res.body.data.getCats).toEqual(
                    cats.map((cat) => {
                      if (cat.id === 1) {
                        cat.name = 'Ventus';
                        cat.breed = 'Russian Red';
                        cat.age = 100;
                      }
                      return cat;
                    }),
                  );
                }),
            )
        );
      });
      it('should remove a cat and have it remove from the array', () => {
        return (
          request(app.getHttpServer())
            .post(gql)
            .send({
              query: 'mutation {removeCat(id: 3) {id name breed age}}',
            })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.removeCat).toEqual({
                name: 'Aqua',
                age: 3,
                breed: 'Maine Coon',
                id: 3,
              });
            })
            // chain another request to see our original one works as expected
            .then(() =>
              request(app.getHttpServer())
                .post(gql)
                .send({ query: '{getCats {id name breed age}}' })
                .expect(200)
                .expect((res) => {
                  cats.pop();
                  expect(res.body.data.getCats).toEqual(cats);
                }),
            )
        );
      });
    });
  });
});
