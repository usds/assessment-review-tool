CREATE EXTENSION pgcrypto;
CREATE EXTENSION "uuid-ossp";

CREATE OR REPLACE FUNCTION update_with_changes()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;