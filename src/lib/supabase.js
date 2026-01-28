import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
// In a real app, these would come from your .env file
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const SUPABASE_URL = 'https://snrqcbdsrvqsozagvlqx.supabase.co'; // Replace with your actual URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucnFjYmRzcnZxc296YWd2bHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNDQ0MjYsImV4cCI6MjA4MjcyMDQyNn0.jC5DbB5a4qcga7mX7sXVnLkZZqI0HQwFTl0SsSIBJQk'; // Replace with your actual Anon Key

const USE_MOCK_BY_DEFAULT = !SUPABASE_URL || !SUPABASE_ANON_KEY;

// ------------------------------------------------------------------
// REAL MOCK CLIENT IMPLEMENTATION
// ------------------------------------------------------------------
class MockSupabaseClient {
    constructor() {
        console.log('⚡️ [Paystash] Initializing MOCK Supabase Client');
        this.auth = {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: (callback) => {
                return { data: { subscription: { unsubscribe: () => { } } } };
            },
            signUp: async ({ email, password, options }) => {
                console.log('⚡️ [Mock] SignUp:', email);
                await new Promise(r => setTimeout(r, 1000)); // Simulate net lag
                const user = { id: 'mock-user-id', email, user_metadata: options?.data };
                // Simulate saving session
                await AsyncStorage.setItem('mock_session', JSON.stringify({ user }));
                return { data: { user, session: { user } }, error: null };
            },
            signInWithPassword: async ({ email, password }) => {
                console.log('⚡️ [Mock] SignIn:', email);
                await new Promise(r => setTimeout(r, 1000));
                if (password === 'error') return { data: { session: null }, error: { message: 'Invalid credentials' } };

                const user = { id: 'mock-user-id', email };
                await AsyncStorage.setItem('mock_session', JSON.stringify({ user }));
                return { data: { session: { user, access_token: 'mock-token' }, user }, error: null };
            },
            signOut: async () => {
                console.log('⚡️ [Mock] SignOut');
                await AsyncStorage.removeItem('mock_session');
                return { error: null };
            }
        };
    }

    from(table) {
        return new MockQueryBuilder(table);
    }
}

class MockQueryBuilder {
    constructor(table) {
        this.table = table;
    }

    select(columns) {
        return this;
    }

    insert(data) {
        console.log(`⚡️ [Mock] Insert into ${this.table}:`, data);
        return Promise.resolve({ data, error: null });
    }

    upsert(data) {
        console.log(`⚡️ [Mock] Upsert into ${this.table}:`, data);
        return Promise.resolve({ data, error: null });
    }

    eq(column, value) {
        // Mock simple equality filtering
        return this;
    }

    order(column, { ascending = true } = {}) {
        return this;
    }

    single() {
        this.isSingle = true;
        return this;
    }

    async then(resolve, reject) {
        // Return mock data based on table
        if (this.table === 'transactions') {
            resolve({ data: [], error: null });
        } else if (this.table === 'profiles') {
            // Mock a profile with balance for the demo
            console.log('⚡️ [Mock] Returning demo profile with ₦5,000 balance');
            const profile = { id: 'mock-user-id', balance: 5000, email: 'demo@paystash.com' };
            resolve({ data: this.isSingle ? profile : [profile], error: null });
        } else {
            resolve({ data: [], error: null });
        }
    }
}

// ------------------------------------------------------------------
// EXPORTED CLIENT
// ------------------------------------------------------------------

let supabase;

if (USE_MOCK_BY_DEFAULT) {
    supabase = new MockSupabaseClient();
} else {
    try {
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                storage: AsyncStorage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
        });
    } catch (error) {
        console.warn('Failed to initialize real Supabase client, falling back to mock.', error);
        supabase = new MockSupabaseClient();
    }
}

export { supabase };
