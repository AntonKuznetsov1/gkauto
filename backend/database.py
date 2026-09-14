import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")

# Prioritize the service_role key to bypass RLS for server-side API operations.
# Fall back to SUPABASE_KEY (anon key) if service_role key is not configured.
SUPABASE_KEY: str = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY") 
    or os.getenv("SUPABASE_KEY", "")
)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY / SUPABASE_KEY environment variables are not set.")

# Initialize the Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_supabase_client() -> Client:
    """Returns the initialized Supabase client instance."""
    return supabase