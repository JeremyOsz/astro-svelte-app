ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people FORCE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'people'
      AND policyname = 'people_select_own'
  ) THEN
    CREATE POLICY people_select_own
      ON public.people
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'people'
      AND policyname = 'people_insert_own'
  ) THEN
    CREATE POLICY people_insert_own
      ON public.people
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'people'
      AND policyname = 'people_update_own'
  ) THEN
    CREATE POLICY people_update_own
      ON public.people
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'people'
      AND policyname = 'people_delete_own'
  ) THEN
    CREATE POLICY people_delete_own
      ON public.people
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END;
$$;
