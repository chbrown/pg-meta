import {Client} from 'pg'

import {ConnectionConfig, QueryResult, Relation, RelationAttribute, RelationConstraint} from './types'
import {PgDatabase} from './pg_catalog'

export async function query<T>(config: ConnectionConfig, queryText: string, values: any[] = []) {
  const client = new Client(config)
  await client.connect()
  const result = await client.query(queryText, values)
  await client.end()
  return result as QueryResult<T>
}

/**
Return a list of the databases accessible in the given PostgreSQL server.
*/
export async function databases(config: ConnectionConfig) {
  return query<PgDatabase>(config, 'SELECT * FROM pg_catalog.pg_database ORDER BY datname').then(({rows}) => rows)
}

/**
params should contain a {database: string} entry

Maybe add to WHERE: pg_catalog.pg_table_is_visible(oid)
*/
export async function relations(config: ConnectionConfig): Promise<Relation[]> {
  return query<Relation>(config, `
    WITH attributes AS (
      SELECT attrelid, attname, attnum, atttypid, atttypmod, attnotnull, adsrc,
        format_type(atttypid, atttypmod) AS atttypfmt
      FROM pg_catalog.pg_attribute
        LEFT JOIN pg_catalog.pg_attrdef ON adrelid = attrelid AND attnum = adnum
      WHERE attnum > 0
        AND NOT attisdropped
      ORDER BY attnum
    ), attributes_agg AS (
      SELECT attrelid, jsonb_agg(attributes.*) AS attributes FROM attributes GROUP BY attrelid
    ), constraints AS (
      SELECT conrelid,
        conname,
        CASE contype
          WHEN 'c' THEN 'check constraint'
          WHEN 'f' THEN 'foreign key constraint'
          WHEN 'p' THEN 'primary key constraint'
          WHEN 'u' THEN 'unique constraint'
          WHEN 't' THEN 'constraint trigger'
          WHEN 'x' THEN 'exclusion constraint'
        END AS contype,
        conkey,
        pg_catalog.regclassout(confrelid) AS confrelname,
        string_agg(fkeyatt.attname, ',') AS fkeyattnames
      FROM pg_catalog.pg_constraint
        LEFT OUTER JOIN pg_catalog.pg_attribute AS fkeyatt ON attrelid = confrelid AND attnum = ANY(confkey)
      GROUP BY pg_constraint.oid, conrelid, conname, contype, confrelid, conkey
    ), constraints_agg AS (
      SELECT conrelid, jsonb_agg(constraints.*) AS constraints FROM constraints GROUP BY conrelid
    ), relations AS (
      SELECT pg_class.oid AS relid,
        relname,
        pg_namespace.nspname AS relnamespace,
        pg_authid.rolname AS relowner,
        CASE relkind
          WHEN 'r' THEN 'ordinary table'
          WHEN 'i' THEN 'index'
          WHEN 'S' THEN 'sequence'
          WHEN 'v' THEN 'view'
          WHEN 'm' THEN 'materialized view'
          WHEN 'c' THEN 'composite type'
          WHEN 't' THEN 'TOAST table'
          WHEN 'f' THEN 'foreign table'
        END AS relkind
      FROM pg_catalog.pg_class
      INNER JOIN pg_catalog.pg_namespace ON pg_namespace.oid = pg_class.relnamespace
      INNER JOIN pg_catalog.pg_authid ON pg_authid.oid = pg_class.relowner
      WHERE pg_namespace.nspname NOT IN
        ('pg_toast', 'pg_temp_1', 'pg_toast_temp_1', 'pg_catalog', 'information_schema')
    )
    SELECT relations.*,
      attributes_agg.attributes,
      constraints_agg.constraints
    FROM relations
      LEFT JOIN attributes_agg ON attributes_agg.attrelid = relations.relid
      LEFT JOIN constraints_agg ON constraints_agg.conrelid = relations.relid
    ORDER BY relid
  `).then(({rows}) => rows)
}

/**
In most cases, atttypid::regtype will return the same thing as
format_type(atttypid, atttypmod), but the latter is more informative when
dealing with variable length or otherwise parameterized types (e.g., varchar).

attnum is negative for system attributes, e.g., 'tableoid', 'cmax', 'ctid', etc.
attisdropped is TRUE for recently (but not yet fully vacuumed) dropped columns.
*/
export async function attributes(config: ConnectionConfig, relid: string) {
  // -- would also need to grab attrelid if we were doing a `WHERE attrelid = ANY($1)` query
  return query<RelationAttribute>(config, `
    SELECT attrelid, attname, attnum, atttypid, atttypmod, attnotnull, adsrc,
      format_type(atttypid, atttypmod) AS atttypfmt
    FROM pg_catalog.pg_attribute
      LEFT OUTER JOIN pg_catalog.pg_attrdef ON adrelid = attrelid AND attnum = adnum
    WHERE attnum > 0
      AND NOT attisdropped
      AND attrelid = $1
    ORDER BY attnum
  `, [relid]).then(({rows}) => rows)
}

/**
Get the constraints associated with the table designated by {relid}.

Returns a list of constraints, each of which has a conkey: number[] field,
indicating which of the columns it depends on.
*/
export async function constraints(config: ConnectionConfig, relid: string) {
  return query<RelationConstraint>(config, `
    SELECT conname,
      CASE contype
        WHEN 'c' THEN 'check constraint'
        WHEN 'f' THEN 'foreign key constraint'
        WHEN 'p' THEN 'primary key constraint'
        WHEN 'u' THEN 'unique constraint'
        WHEN 't' THEN 'constraint trigger'
        WHEN 'x' THEN 'exclusion constraint'
      END AS contype,
      conkey,
      pg_catalog.regclassout(confrelid) AS confrelname,
      string_agg(fkeyatt.attname, ',') AS fkeyattnames
    FROM pg_catalog.pg_constraint
      LEFT OUTER JOIN pg_catalog.pg_attribute AS fkeyatt ON attrelid = confrelid AND attnum = ANY(confkey)
    WHERE conrelid = $1
    GROUP BY pg_constraint.oid, conname, contype, confrelid, conkey
  `, [relid]).then(({rows}) => rows)
}

/**
Vulnerable to SQL injection via the 'table' argument.
*/
export async function count(config: ConnectionConfig, table: string) {
  return query<{count: number}>(config, `SELECT COUNT(*) FROM ${table}`).then(({rows}) => {
    return rows[0].count
  })
}
