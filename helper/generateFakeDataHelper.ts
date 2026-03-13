import { faker } from '@faker-js/faker';

export type FakeData = {
  employeeName: string;
  shiftType: string;
  resource: string;
  description: string;
  shiftName: string;
};

export const generateFakeData = (): FakeData => {
  return {
    employeeName: 'Holen',
    shiftType: 'Mittag-Schicht',
    resource: 'Holen',
    description: 'Test shift description',
    shiftName: 'Test shift name',
  };
};
