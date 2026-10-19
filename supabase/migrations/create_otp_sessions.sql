-- Run this SQL in your Supabase SQL Editor to create the OTP sessions table.
-- Go to: https://supabase.com/dashboard → your project → SQL Editor

CREATE TABLE IF NOT EXISTS otp_sessions (
  id          BIGSERIAL PRIMARY KEY,
  mobile_number BIGINT NOT NULL,
  otp         TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by mobile_number
CREATE INDEX IF NOT EXISTS idx_otp_sessions_mobile ON otp_sessions(mobile_number);

-- Optional: auto-delete expired OTPs older than 1 hour (cleanup)
-- You can run this as a cron job or via pg_cron extension in Supabase
-- DELETE FROM otp_sessions WHERE expires_at < NOW() - INTERVAL '1 hour';
