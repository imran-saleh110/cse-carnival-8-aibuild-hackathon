import { db } from '../src/config/database';

async function checkColumns() {
  const { rows } = await db.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    ORDER BY table_name, ordinal_position;
  `);

  console.log('Database Columns:');
  for (const r of rows) {
    console.log(`- ${r.table_name}.${r.column_name} (${r.data_type})`);
  }
  await db.pool.end();
}

checkColumns();
