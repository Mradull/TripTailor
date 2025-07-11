import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wrvgfidzznzqnqlwhbal.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndydmdmaWR6em56cW5xbHdoYmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODI1NDgsImV4cCI6MjA2NzQ1ODU0OH0.vK1_Rx6ktDRfOKPwJiJaw2sWk730t9HRnC0xs2PrYyQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
