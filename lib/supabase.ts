
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://llelyepqqrsgoqhifvyr.supabase.co';
const supabaseAnonKey = 'sb_publishable_753IdWdIwZMQfvgkjMLHxw_x1ACTbqR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
