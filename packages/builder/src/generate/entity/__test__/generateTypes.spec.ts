import * as fs from 'fs';
import generateTypes from '../generateTypes';

jest.mock('fs', () => {
    const original = jest.requireActual('fs');
    return {
        ...original,
        writeFileSync: jest.fn(),
    };
});
const writeFileSyncMock = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;

describe('generateTypes', () => {
    it('should generate correct type for an array of custom type', () => {
        generateTypes({
            entityName: 'Custom',
            outdir: 'src',
            parents: [],
            entity: {
                properties: {
                    customArray: {
                        type: 'array',
                        items: { type: 'CustomType' },
                    },
                },
            },
        } as any);
        const expected = `import { BaseEntity } from "../types";
import { CustomType } from "../globals";

interface BaseCustom extends BaseEntity {
  id: string;
  customArray?: Array<CustomType | undefined>;
}

export type Custom = BaseCustom;
`;
        const actual = writeFileSyncMock.mock.calls[0][1];
        expect(actual).toEqual(expected);
    });

    it('should append | null to array type when isNullable is true', () => {
        writeFileSyncMock.mockClear();
        generateTypes({
            entityName: 'Schedule',
            outdir: 'src',
            parents: [],
            entity: {
                properties: {
                    weekDays: {
                        type: 'array',
                        items: { type: 'number' },
                        isRequired: false,
                        isNullable: true,
                    },
                },
            },
        } as any);
        const expected = `import { BaseEntity } from "../types";

interface BaseSchedule extends BaseEntity {
  id: string;
  weekDays?: Array<number> | null;
}

export type Schedule = BaseSchedule;
`;
        const actual = writeFileSyncMock.mock.calls[0][1];
        expect(actual).toEqual(expected);
    });
});
