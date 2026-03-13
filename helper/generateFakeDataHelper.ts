import { faker } from '@faker-js/faker';

export type FakeData = {
  employeeName: string;
  shiftType: string;
  resource: string;
  description: string;
};

export const generateFakeData = (): FakeData => {
  return {
    employeeName: 'Holen',
    shiftType: 'Mittag-Schicht',
    resource: 'Holen',
    description: 'Test shift description',
  };
};
