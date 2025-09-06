import { supabase } from './supabase';

export const createUserProfilesTable = async () => {
  try {
    // Create user_profiles table
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          user_id TEXT PRIMARY KEY,
          name TEXT,
          preferences JSONB DEFAULT '{}',
          budget_range TEXT,
          travel_style TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view own profile" ON user_profiles
          FOR SELECT USING (auth.uid()::text = user_id);

        CREATE POLICY "Users can insert own profile" ON user_profiles
          FOR INSERT WITH CHECK (auth.uid()::text = user_id);

        CREATE POLICY "Users can update own profile" ON user_profiles
          FOR UPDATE USING (auth.uid()::text = user_id);

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_travel_style ON user_profiles(travel_style);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_budget_range ON user_profiles(budget_range);

        -- Create trigger for updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_user_profiles_updated_at
          BEFORE UPDATE ON user_profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (error) {
      console.error('Error creating user_profiles table:', error);
      return { success: false, error: error.message };
    }

    console.log('user_profiles table created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating user_profiles table:', error);
    return { success: false, error: 'Failed to create table' };
  }
};

// User profile management functions
export interface UserProfile {
  user_id: string;
  name: string | null;
  preferences: Record<string, any>;
  budget_range: string | null;
  travel_style: string | null;
  created_at: string;
  updated_at: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Profile doesn't exist
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const createUserProfile = async (profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .insert(profile);

    if (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: 'Failed to create profile' };
  }
};

export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Omit<UserProfile, 'user_id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
};