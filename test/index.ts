import test from 'ava'

import {query, databases, relations, attributes, constraints} from '../index'

const config = {host: '127.0.0.1', port: 5432, database: 'postgres'}
const test_config = {...config, database: 'pg-meta-test'}

test.before(async t => {
  await query(test_config, 'CREATE TABLE a()')
})

test.after.always(async t => {
  await query(test_config, 'DROP TABLE a')
})

test('databases', async t => {
  const pg_databases = await databases(config)
  t.truthy(pg_databases.length, 'list of databases should not be empty')
})

test('relations', async t => {
  const test_relations = await relations(test_config)
  t.is(test_relations.length, 2, 'list of relations should have two entries')
})

test('attributes', async t => {
  const test_relations = await relations(test_config)
  const a_relid = test_relations.find(relation => relation.relname == 'a').relid
  const a_attributes = await attributes(test_config, a_relid)
  t.is(a_attributes.length, 0, 'table "a" should have no attributes')
})

test('constraints', async t => {
  const test_relations = await relations(test_config)
  const a_relid = test_relations.find(relation => relation.relname == 'a').relid
  const a_constraints = await constraints(test_config, a_relid)
  t.is(a_constraints.length, 0, 'table "a" should have no constraints')
})
