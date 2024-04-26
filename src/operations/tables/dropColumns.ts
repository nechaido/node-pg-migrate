import type { MigrationOptions } from '../../types';
import { formatLines } from '../../utils';
import type { DropOptions, Name } from '../generalTypes';

export type DropColumnsOptions = DropOptions;

export type DropColumns = (
  tableName: Name,
  columns: string | string[] | { [name: string]: unknown },
  dropOptions?: DropColumnsOptions
) => string;

export function dropColumns(mOptions: MigrationOptions): DropColumns {
  const _drop: DropColumns = (tableName, columns, options = {}) => {
    const { ifExists = false, cascade = false } = options;

    if (typeof columns === 'string') {
      columns = [columns];
    } else if (!Array.isArray(columns) && typeof columns === 'object') {
      columns = Object.keys(columns);
    }

    const ifExistsStr = ifExists ? 'IF EXISTS ' : '';
    const cascadeStr = cascade ? ' CASCADE' : '';
    const columnsStr = formatLines(
      columns.map(mOptions.literal),
      `  DROP ${ifExistsStr}`,
      `${cascadeStr},`
    );

    return `ALTER TABLE ${mOptions.literal(tableName)}
${columnsStr};`;
  };

  return _drop;
}
