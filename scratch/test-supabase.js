const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  
  const tables = ['shop_settings', 'products', 'customers', 'invoices'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: ERROR - ${error.message}`);
    } else {
      console.log(`Table ${table}: SUCCESS - Found ${data.length} records`);
      if (data.length > 0) {
        console.log(`Sample data from ${table}:`, JSON.stringify(data[0], null, 2));
      }
    }
  }
}

testConnection();
