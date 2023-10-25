import type {Person} from '@/data';
import {faker} from '@faker-js/faker';

interface Response {
  nodes: Person[];
  pageInfo: {
    hasNextPage: boolean;
  };
}

export function fetcher(pageInfo: {index: number; size: number}): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('fetch', pageInfo);
      resolve({
        nodes: faker.helpers.uniqueArray(faker.number.int, pageInfo.size).map((_, i) => ({
          firstName: faker.person.firstName(),
          lastName: `${pageInfo.index} ${i}`,
          age: i + pageInfo.index,
          visits: i * 23,
          status: 'In Relationship',
          progress: 50,
        })),
        pageInfo: {
          hasNextPage: pageInfo.index < 20,
        },
      });
    }, 1000);
  });
}
