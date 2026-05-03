import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mkgtelifcumbsmqhavkc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_XSylIhz-Ul8NG-TvsYgE5g_x9mH7MRs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
