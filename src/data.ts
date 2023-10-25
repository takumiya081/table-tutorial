import {faker} from '@faker-js/faker';

export interface Person {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
}

export const data = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
] satisfies Person[];

export function getData(count: number): Person[] {
  return faker.helpers.uniqueArray(faker.number.int, count).map((_, i) => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: i,
    visits: i * 23,
    status: 'In Relationship',
    progress: 50,
  }));
}
