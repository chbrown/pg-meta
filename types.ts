/*******************************************************************************
                           Node.js 'pg' module types
*******************************************************************************/

/** Also called "field description".
See https://github.com/brianc/node-postgres/blob/v4.4.3/lib/connection.js#L468
*/
export interface Field {
  name: string;
  tableID: number;
  columnID: number;
  /** Corresponds to the oid of table pg_catalog.pg_type */
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
  format: string;
}

export interface QueryResult<T> {
  command: string;
  rowCount: number;
  oid: number;
  rows: T[];
  fields: Field[];
  RowCtor: Function;
  rowAsArray: boolean;
}

export interface ConnectionConfig {
  user?: string;
  database?: string;
  password?: string;
  port?: number;
  host?: string;
  ssl?: boolean;
}

/*******************************************************************************
                         custom aggregated types
*******************************************************************************/

export interface RelationAttribute {
  /** The column name */
  attname: string;
  /** The number of the column. */
  attnum: number;
  /** The data type of this column as described by format_type. */
  atttyp: string;
  /** This represents a not-null constraint. */
  attnotnull: boolean;
  /** A human-readable representation of the default value */
  adsrc?: string;
}

export interface RelationConstraint {
  /** constraint name (not necessarily unique) */
  conname: string;
  /** one of: 'check constraint', 'foreign key constraint',
  'primary key constraint', 'unique constraint', 'constraint trigger',
  'exclusion constraint' */
  contype: string;
  /** 1-based indices of the constrained columns */
  conkey: number[];
  /** name of the foreign-referenced relation */
  confrelname: string;
  /** name of the attributes (columns) on the foreign relation */
  fkeyattnames: string;
}

export interface Relation {
  /** equivalent to pg_class.oid */
  relid: string;
  /** equivalent to pg_class.relname */
  relname: string;
  /** one of: 'ordinary table', 'index', 'sequence', 'view',
  'materialized view', 'composite type', 'TOAST table', 'foreign table' */
  relkind: string;
  attributes: RelationAttribute[];
  constraints: RelationConstraint[];
}
