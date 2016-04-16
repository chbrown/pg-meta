/*******************************************************************************
  pg_catalog types: http://www.postgresql.org/docs/current/static/catalogs.html
*******************************************************************************/

export type name = string;
export type text = string;
export type integer = number;
export type int4 = number;
export type int2 = number;
export type float4 = number;
export type bool = boolean;
export type char = string;
export type pg_node_tree = string;
/** object identifier */
export type oid = number;
/** transaction "xact" identifier */
export type xid = number;
/** Access privileges (I think it's a string) */
export type aclitem = string;
/** function name */
export type regproc = string;

/** Table "pg_catalog.pg_database" */
export interface PgDatabase {
  /** Row identifier (hidden attribute; must be explicitly selected) */
  oid: oid;
  /** Database name */
  datname: name;
  /** Owner of the database, usually the user who created it */
  datdba: oid;
  /** Character encoding for this database (pg_encoding_to_char() can translate this number to the encoding name) */
  encoding: int4;
  /** LC_COLLATE for this database */
  datcollate: name;
  /** LC_CTYPE for this database */
  datctype: name;
  /** If true, then this database can be cloned by any user with CREATEDB privileges; if false, then only superusers or the owner of the database can clone it. */
  datistemplate: bool;
  /** If false then no one can connect to this database. This is used to protect the template0 database from being altered. */
  datallowconn: bool;
  /** Sets maximum number of concurrent connections that can be made to this database. -1 means no limit. */
  datconnlimit: int4;
  /** Last system OID in the database; useful particularly to pg_dump */
  datlastsysoid: oid;
  /** All transaction IDs before this one have been replaced with a permanent ("frozen") transaction ID in this database. This is used to track whether the database needs to be vacuumed in order to prevent transaction ID wraparound or to allow pg_clog to be shrunk. It is the minimum of the per-table pg_class.relfrozenxid values. */
  datfrozenxid: xid;
  /** All multixact IDs before this one have been replaced with a transaction ID in this database. This is used to track whether the database needs to be vacuumed in order to prevent multixact ID wraparound or to allow pg_multixact to be shrunk. It is the minimum of the per-table pg_class.relminmxid values. */
  datminmxid: xid;
  /** The default tablespace for the database. Within this database, all tables for which pg_class.reltablespace is zero will be stored in this tablespace; in particular, all the non-shared system catalogs will be there. */
  dattablespace: oid;
  /** Access privileges; see GRANT and REVOKE for details */
  datacl: aclitem[];
}

/** Table "pg_catalog.pg_tables" (http://www.postgresql.org/docs/current/static/view-pg-tables.html) */
export interface PgTable {
  /** Name of schema containing table (references pg_namespace.nspname) */
  schemaname:  name;
  /** Name of table (references pg_class.relname) */
  tablename:   name;
  /** Name of table's owner (references pg_authid.rolname) */
  tableowner:  name;
  /** Name of tablespace containing table (null if default for database) (references pg_tablespace.spcname) */
  tablespace:  name;
  /** True if table has (or recently had) any indexes (references pg_class.relhasindex) */
  hasindexes:  boolean;
  /** True if table has (or once had) rules (references pg_class.relhasrules) */
  hasrules:    boolean;
  /** True if table has (or once had) triggers (references pg_class.relhastriggers) */
  hastriggers: boolean;
  /** True if row security is enabled on the table (references pg_class.relrowsecurity) */
  rowsecurity: boolean;
}

/** Table "pg_catalog.pg_attribute" (http://www.postgresql.org/docs/current/static/catalog-pg-attribute.html) */
export interface PgAttribute {
  /** The table this column belongs to (references pg_class.oid) */
  attrelid: oid;
  /** The column name */
  attname: name;
  /** The data type of this column (references pg_type.oid).
  Can be cast to 'regtype' to get a generic string representation.
  */
  atttypid: oid;
  /** attstattarget controls the level of detail of statistics accumulated for this column by ANALYZE. A zero value indicates that no statistics should be collected. A negative value says to use the system default statistics target. The exact meaning of positive values is data type-dependent. For scalar data types, attstattarget is both the target number of "most common values" to collect, and the target number of histogram bins to create. */
  attstattarget: int4;
  /** A copy of pg_type.typlen of this column's type */
  attlen: int2;
  /** The number of the column. Ordinary columns are numbered from 1 up. System columns, such as oid, have (arbitrary) negative numbers. */
  attnum: int2;
  /** Number of dimensions, if the column is an array type; otherwise 0. (Presently, the number of dimensions of an array is not enforced, so any nonzero value effectively means "it's an array".) */
  attndims: int4;
  /** Always -1 in storage, but when loaded into a row descriptor in memory this might be updated to cache the offset of the attribute within the row */
  attcacheoff: int4;
  /** atttypmod records type-specific data supplied at table creation time (for example, the maximum length of a varchar column). It is passed to type-specific input functions and length coercion functions. The value will generally be -1 for types that do not need atttypmod. */
  atttypmod: int4;
  /** A copy of pg_type.typbyval of this column's type */
  attbyval: bool;
  /** Normally a copy of pg_type.typstorage of this column's type. For TOAST-able data types, this can be altered after column creation to control storage policy. */
  attstorage: char;
  /** A copy of pg_type.typalign of this column's type */
  attalign: char;
  /** This represents a not-null constraint. */
  attnotnull: bool;
  /** This column has a default value, in which case there will be a corresponding entry in the pg_attrdef catalog that actually defines the value. */
  atthasdef: bool;
  /** This column has been dropped and is no longer valid. A dropped column is still physically present in the table, but is ignored by the parser and so cannot be accessed via SQL. */
  attisdropped: bool;
  /** This column is defined locally in the relation. Note that a column can be locally defined and inherited simultaneously. */
  attislocal: bool;
  /** The number of direct ancestors this column has. A column with a nonzero number of ancestors cannot be dropped nor renamed. */
  attinhcount: int4;
  /** The defined collation of the column, or zero if the column is not of a collatable data type. (references pg_collation.oid) */
  attcollation: oid;
  /** Column-level access privileges, if any have been granted specifically on this column */
  attacl: aclitem[];
  /** Attribute-level options, as "keyword=value" strings */
  attoptions: text[];
  /** Attribute-level foreign data wrapper options, as "keyword=value" strings */
  attfdwoptions: text[];
}

/** Table "pg_catalog.pg_attrdef" */
export interface PgAttrDef {
  /** Row identifier (hidden attribute; must be explicitly selected) */
  oid: oid;
  /** The table this column belongs to */
  adrelid: oid;
  /** The number of the column */
  adnum: int2;
  /** The internal representation of the column default value */
  adbin: pg_node_tree;
  /** A human-readable representation of the default value */
  adsrc: text;
}

/** Table "pg_catalog.pg_constraint" */
export interface PgConstraint {
  /** Row identifier (hidden attribute; must be explicitly selected) */
  oid: oid;
  /** Constraint name (not necessarily unique!) */
  conname: name;
  /** The OID of the namespace that contains this constraint (references pg_namespace.oid) */
  connamespace: oid;
  /** c = check constraint, f = foreign key constraint, p = primary key constraint, u = unique constraint, t = constraint trigger, x = exclusion constraint */
  contype: char;
  /** Is the constraint deferrable? */
  condeferrable: bool;
  /** Is the constraint deferred by default? */
  condeferred: bool;
  /** Has the constraint been validated? Currently, can only be false for foreign keys and CHECK constraints */
  convalidated: bool;
  /** The table this constraint is on; 0 if not a table constraint (references pg_class.oid) */
  conrelid: oid;
  /** The domain this constraint is on; 0 if not a domain constraint (references pg_type.oid) */
  contypid: oid;
  /** The index supporting this constraint, if it's a unique, primary key, foreign key, or exclusion constraint; else 0 (references pg_class.oid) */
  conindid: oid;
  /** If a foreign key, the referenced table; else 0 (references pg_class.oid) */
  confrelid: oid;
  /** Foreign key update action code: a = no action, r = restrict, c = cascade, n = set null, d = set default */
  confupdtype: char;
  /** Foreign key deletion action code: a = no action, r = restrict, c = cascade, n = set null, d = set default */
  confdeltype: char;
  /** Foreign key match type: f = full, p = partial, s = simple */
  confmatchtype: char;
  /** This constraint is defined locally for the relation. Note that a constraint can be locally defined and inherited simultaneously. */
  conislocal: bool;
  /** The number of direct inheritance ancestors this constraint has. A constraint with a nonzero number of ancestors cannot be dropped nor renamed. */
  coninhcount: int4;
  /** This constraint is defined locally for the relation. It is a non-inheritable constraint. */
  connoinherit: bool;
  /** If a table constraint (including foreign keys, but not constraint triggers), list of the constrained columns (references pg_attribute.attnum) */
  conkey: int2[];
  /** If a foreign key, list of the referenced columns (references pg_attribute.attnum) */
  confkey: int2[];
  /** If a foreign key, list of the equality operators for PK = FK comparisons (references pg_operator.oid) */
  conpfeqop: oid[];
  /** If a foreign key, list of the equality operators for PK = PK comparisons (references pg_operator.oid) */
  conppeqop: oid[];
  /** If a foreign key, list of the equality operators for FK = FK comparisons (references pg_operator.oid) */
  conffeqop: oid[];
  /** If an exclusion constraint, list of the per-column exclusion operators (references pg_operator.oid) */
  conexclop: oid[];
  /** If a check constraint, an internal representation of the expression */
  conbin: pg_node_tree;
  /** If a check constraint, a human-readable representation of the expression */
  consrc: text;
}

/** Table "pg_catalog.pg_type" */
export interface PgType {
  /** Data type name */
  typname: name;
  /** The OID of the namespace that contains this type */
  typnamespace: oid;
  /** Owner of the type */
  typowner: oid;
  /** For a fixed-size type, typlen is the number of bytes in the internal representation of the type. But for a variable-length type, typlen is negative. -1 indicates a "varlena" type (one that has a length word), -2 indicates a null-terminated C string. */
  typlen: int2;
  /** typbyval determines whether internal routines pass a value of this type by value or by reference. typbyval had better be false if typlen is not 1, 2, or 4 (or 8 on machines where Datum is 8 bytes). Variable-length types are always passed by reference. Note that typbyval can be false even if the length would allow pass-by-value */
  typbyval: bool;
  /** typtype is b for a base type, c for a composite type (e.g., a table's row type), d for a domain, e for an enum type, or p for a pseudo-type. See also typrelid and typbasetype */
  typtype: char;
  /** typcategory is an arbitrary classification of data types that is used by the parser to determine which implicit casts should be "preferred". See Table 44-43 */
  typcategory: char;
  /** True if the type is a preferred cast target within its typcategory */
  typispreferred: bool;
  /** True if the type is defined, false if this is a placeholder entry for a not-yet-defined type. When typisdefined is false, nothing except the type name, namespace, and OID can be relied on */
  typisdefined: bool;
  /** Character that separates two values of this type when parsing array input. Note that the delimiter is associated with the array element data type, not the array data type */
  typdelim: char;
  /** If this is a composite type (see typtype), then this column points to the pg_class entry that defines the corresponding table. (For a free-standing composite type, the pg_class entry doesn't really represent a table, but it is needed anyway for the type's pg_attribute entries to link to.) Zero for non-composite types */
  typrelid: oid;
  /** If typelem is not 0 then it identifies another row in pg_type. The current type can then be subscripted like an array yielding values of type typelem. A "true" array type is variable length (typlen = -1), but some fixed-length (typlen > 0) types also have nonzero typelem, for example name and point. If a fixed-length type has a typelem then its internal representation must be some number of values of the typelem data type with no other data. Variable-length array types have a header defined by the array subroutines */
  typelem: oid;
  /** If typarray is not 0 then it identifies another row in pg_type, which is the "true" array type having this type as element */
  typarray: oid;
  /** Input conversion function (text format) */
  typinput: regproc;
  /** Output conversion function (text format) */
  typoutput: regproc;
  /** Input conversion function (binary format), or 0 if none */
  typreceive: regproc;
  /** Output conversion function (binary format), or 0 if none */
  typsend: regproc;
  /** Type modifier input function, or 0 if type does not support modifiers */
  typmodin: regproc;
  /** Type modifier output function, or 0 to use the standard format */
  typmodout: regproc;
  /** Custom ANALYZE function, or 0 to use the standard function */
  typanalyze: regproc;
  /** typalign is the alignment required when storing a value of this type. It applies to storage on disk as well as most representations of the value inside PostgreSQL. When multiple values are stored consecutively, such as in the representation of a complete row on disk, padding is inserted before a datum of this type so that it begins on the specified boundary. The alignment reference is the beginning of the first datum in the sequence.
  Possible values are:
  c = char alignment, i.e., no alignment needed.
  s = short alignment (2 bytes on most machines).
  i = int alignment (4 bytes on most machines).
  d = double alignment (8 bytes on many machines, but by no means all).
  Note: For types used in system tables, it is critical that the size and alignment defined in pg_type agree with the way that the compiler will lay out the column in a structure representing a table row. */
  typalign: char;
  /** typstorage tells for varlena types (those with typlen = -1) if the type is prepared for toasting and what the default strategy for attributes of this type should be. Possible values are
  p: Value must always be stored plain.
  e: Value can be stored in a "secondary" relation (if relation has one, see pg_class.reltoastrelid).
  m: Value can be stored compressed inline.
  x: Value can be stored compressed inline or stored in "secondary" storage.
  Note that m columns can also be moved out to secondary storage, but only as a last resort (e and x columns are moved first). */
  typstorage: char;
  /** typnotnull represents a not-null constraint on a type. Used for domains only */
  typnotnull: bool;
  /** If this is a domain (see typtype), then typbasetype identifies the type that this one is based on. Zero if this type is not a domain */
  typbasetype: oid;
  /** Domains use typtypmod to record the typmod to be applied to their base type (-1 if base type does not use a typmod). -1 if this type is not a domain */
  typtypmod: int4;
  /** typndims is the number of array dimensions for a domain that is an array (that is, typbasetype is an array type; the domain's typelem will match the base type's typelem). Zero for types other than domains over array types */
  typndims: int4;
  /** If typdefaultbin is not null, it is the nodeToString() representation of a default expression for the type. This is only used for domains */
  typdefaultbin: text;
  /** typdefault is null if the type has no associated default value. If typdefaultbin is not null, typdefault must contain a human-readable version of the default expression represented by typdefaultbin. If typdefaultbin is null and typdefault is not, then typdefault is the external representation of the type's default value, which might be fed to the type's input converter to produce a constant */
  typdefault: text;
}

/** Table "pg_catalog.pg_class" */
export interface PgClass {
  /** Row identifier (hidden attribute; must be explicitly selected) */
  oid: oid;
  /** Name of the table, index, view, etc. */
  relname: name;
  /** The OID of the namespace that contains this relation */
  relnamespace: oid;
  /** The OID of the data type that corresponds to this table's row type, if any (zero for indexes, which have no pg_type entry) */
  reltype: oid;
  /** For typed tables, the OID of the underlying composite type, zero for all other relations */
  reloftype: oid;
  /** Owner of the relation */
  relowner: oid;
  /** If this is an index, the access method used (B-tree, hash, etc.) */
  relam: oid;
  /** Name of the on-disk file of this relation; zero means this is a "mapped" relation whose disk file name is determined by low-level state */
  relfilenode: oid;
  /** The tablespace in which this relation is stored. If zero, the database's default tablespace is implied. (Not meaningful if the relation has no on-disk file.) */
  reltablespace: oid;
  /** Size of the on-disk representation of this table in pages (of size BLCKSZ). This is only an estimate used by the planner. It is updated by VACUUM, ANALYZE, and a few DDL commands such as CREATE INDEX. */
  relpages: int4;
  /** Number of rows in the table. This is only an estimate used by the planner. It is updated by VACUUM, ANALYZE, and a few DDL commands such as CREATE INDEX. */
  reltuples: float4;
  /** Number of pages that are marked all-visible in the table's visibility map. This is only an estimate used by the planner. It is updated by VACUUM, ANALYZE, and a few DDL commands such as CREATE INDEX. */
  relallvisible: int4;
  /** OID of the TOAST table associated with this table, 0 if none. The TOAST table stores large attributes "out of line" in a secondary table. */
  reltoastrelid: oid;
  /** True if this is a table and it has (or recently had) any indexes */
  relhasindex: bool;
  /** True if this table is shared across all databases in the cluster. Only certain system catalogs (such as pg_database) are shared. */
  relisshared: bool;
  /** p = permanent table, u = unlogged table, t = temporary table */
  relpersistence: char;
  /** r = ordinary table, i = index, S = sequence, v = view, m = materialized view, c = composite type, t = TOAST table, f = foreign table */
  relkind: char;
  /** Number of user columns in the relation (system columns not counted). There must be this many corresponding entries in pg_attribute. See also pg_attribute.attnum. */
  relnatts: int2;
  /** Number of CHECK constraints on the table; see pg_constraint catalog */
  relchecks: int2;
  /** True if we generate an OID for each row of the relation */
  relhasoids: bool;
  /** True if the table has (or once had) a primary key */
  relhaspkey: bool;
  /** True if table has (or once had) rules; see pg_rewrite catalog */
  relhasrules: bool;
  /** True if table has (or once had) triggers; see pg_trigger catalog */
  relhastriggers: bool;
  /** True if table has (or once had) any inheritance children */
  relhassubclass: bool;
  /** True if table has row level security enabled; see pg_policy catalog */
  relrowsecurity: bool;
  /** True if row level security (when enabled) will also apply to table owner; see pg_policy catalog */
  relforcerowsecurity: bool;
  /** True if relation is populated (this is true for all relations other than some materialized views) */
  relispopulated: bool;
  /** Columns used to form "replica identity" for rows: d = default (primary key, if any), n = nothing, f = all columns i = index with indisreplident set, or default */
  relreplident: char;
  /** All transaction IDs before this one have been replaced with a permanent ("frozen") transaction ID in this table. This is used to track whether the table needs to be vacuumed in order to prevent transaction ID wraparound or to allow pg_clog to be shrunk. Zero (InvalidTransactionId) if the relation is not a table. */
  relfrozenxid: xid;
  /** All multixact IDs before this one have been replaced by a transaction ID in this table. This is used to track whether the table needs to be vacuumed in order to prevent multixact ID wraparound or to allow pg_multixact to be shrunk. Zero (InvalidMultiXactId) if the relation is not a table. */
  relminmxid: xid;
  /** Access privileges; see GRANT and REVOKE for details */
  relacl: aclitem[];
  /** Access-method-specific options, as "keyword=value" strings */
  reloptions: text[];
}

/**
Static copy of the mapping in pg_catalog.pg_type from pg_type.oid to regclass.

Generated from the query:

    SELECT oid, oid::regtype AS regtype
      FROM pg_catalog.pg_type
      WHERE oid < 10000
      ORDER BY oid ASC
*/
export const regtype: {[index: number]: string} = {
  16: 'boolean',
  17: 'bytea',
  18: 'char',
  19: 'name',
  20: 'bigint',
  21: 'smallint',
  22: 'int2vector',
  23: 'integer',
  24: 'regproc',
  25: 'text',
  26: 'oid',
  27: 'tid',
  28: 'xid',
  29: 'cid',
  30: 'oidvector',
  32: 'pg_ddl_command',
  71: 'pg_type',
  75: 'pg_attribute',
  81: 'pg_proc',
  83: 'pg_class',
  114: 'json',
  142: 'xml',
  143: 'xml[]',
  194: 'pg_node_tree',
  199: 'json[]',
  210: 'smgr',
  600: 'point',
  601: 'lseg',
  602: 'path',
  603: 'box',
  604: 'polygon',
  628: 'line',
  629: 'line[]',
  650: 'cidr',
  651: 'cidr[]',
  700: 'real',
  701: 'double precision',
  702: 'abstime',
  703: 'reltime',
  704: 'tinterval',
  705: 'unknown',
  718: 'circle',
  719: 'circle[]',
  790: 'money',
  791: 'money[]',
  829: 'macaddr',
  869: 'inet',
  1000: 'boolean[]',
  1001: 'bytea[]',
  1002: 'char[]',
  1003: 'name[]',
  1005: 'smallint[]',
  1006: 'int2vector[]',
  1007: 'integer[]',
  1008: 'regproc[]',
  1009: 'text[]',
  1010: 'tid[]',
  1011: 'xid[]',
  1012: 'cid[]',
  1013: 'oidvector[]',
  1014: 'character[]',
  1015: 'character varying[]',
  1016: 'bigint[]',
  1017: 'point[]',
  1018: 'lseg[]',
  1019: 'path[]',
  1020: 'box[]',
  1021: 'real[]',
  1022: 'double precision[]',
  1023: 'abstime[]',
  1024: 'reltime[]',
  1025: 'tinterval[]',
  1027: 'polygon[]',
  1028: 'oid[]',
  1033: 'aclitem',
  1034: 'aclitem[]',
  1040: 'macaddr[]',
  1041: 'inet[]',
  1042: 'character',
  1043: 'character varying',
  1082: 'date',
  1083: 'time without time zone',
  1114: 'timestamp without time zone',
  1115: 'timestamp without time zone[]',
  1182: 'date[]',
  1183: 'time without time zone[]',
  1184: 'timestamp with time zone',
  1185: 'timestamp with time zone[]',
  1186: 'interval',
  1187: 'interval[]',
  1231: 'numeric[]',
  1248: 'pg_database',
  1263: 'cstring[]',
  1266: 'time with time zone',
  1270: 'time with time zone[]',
  1560: 'bit',
  1561: 'bit[]',
  1562: 'bit varying',
  1563: 'bit varying[]',
  1700: 'numeric',
  1790: 'refcursor',
  2201: 'refcursor[]',
  2202: 'regprocedure',
  2203: 'regoper',
  2204: 'regoperator',
  2205: 'regclass',
  2206: 'regtype',
  2207: 'regprocedure[]',
  2208: 'regoper[]',
  2209: 'regoperator[]',
  2210: 'regclass[]',
  2211: 'regtype[]',
  2249: 'record',
  2275: 'cstring',
  2276: 'any',
  2277: 'anyarray',
  2278: 'void',
  2279: 'trigger',
  2280: 'language_handler',
  2281: 'internal',
  2282: 'opaque',
  2283: 'anyelement',
  2287: 'record[]',
  2776: 'anynonarray',
  2842: 'pg_authid',
  2843: 'pg_auth_members',
  2949: 'txid_snapshot[]',
  2950: 'uuid',
  2951: 'uuid[]',
  2970: 'txid_snapshot',
  3115: 'fdw_handler',
  3220: 'pg_lsn',
  3221: 'pg_lsn[]',
  3310: 'tsm_handler',
  3500: 'anyenum',
  3614: 'tsvector',
  3615: 'tsquery',
  3642: 'gtsvector',
  3643: 'tsvector[]',
  3644: 'gtsvector[]',
  3645: 'tsquery[]',
  3734: 'regconfig',
  3735: 'regconfig[]',
  3769: 'regdictionary',
  3770: 'regdictionary[]',
  3802: 'jsonb',
  3807: 'jsonb[]',
  3831: 'anyrange',
  3838: 'event_trigger',
  3904: 'int4range',
  3905: 'int4range[]',
  3906: 'numrange',
  3907: 'numrange[]',
  3908: 'tsrange',
  3909: 'tsrange[]',
  3910: 'tstzrange',
  3911: 'tstzrange[]',
  3912: 'daterange',
  3913: 'daterange[]',
  3926: 'int8range',
  3927: 'int8range[]',
  4089: 'regnamespace',
  4090: 'regnamespace[]',
  4096: 'regrole',
  4097: 'regrole[]',
};
