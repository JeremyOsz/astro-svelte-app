ALTER TABLE public.people
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.people
  ADD COLUMN IF NOT EXISTS anonymous_id text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'people_owner_check'
      AND conrelid = 'public.people'::regclass
  ) THEN
    ALTER TABLE public.people
      ADD CONSTRAINT people_owner_check
      CHECK (
        ((CASE WHEN user_id IS NULL THEN 0 ELSE 1 END) + (CASE WHEN anonymous_id IS NULL THEN 0 ELSE 1 END)) = 1
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS people_anonymous_id_idx ON public.people(anonymous_id);

CREATE TABLE IF NOT EXISTS public.feature_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature text NOT NULL,
  action text NOT NULL,
  route text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id text,
  metadata jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT feature_usage_events_owner_check CHECK (
    ((CASE WHEN user_id IS NULL THEN 0 ELSE 1 END) + (CASE WHEN anonymous_id IS NULL THEN 0 ELSE 1 END)) = 1
  )
);

CREATE INDEX IF NOT EXISTS feature_usage_events_feature_idx ON public.feature_usage_events(feature);
CREATE INDEX IF NOT EXISTS feature_usage_events_action_idx ON public.feature_usage_events(action);
CREATE INDEX IF NOT EXISTS feature_usage_events_created_at_idx ON public.feature_usage_events(created_at DESC);
CREATE INDEX IF NOT EXISTS feature_usage_events_user_id_idx ON public.feature_usage_events(user_id);
CREATE INDEX IF NOT EXISTS feature_usage_events_anonymous_id_idx ON public.feature_usage_events(anonymous_id);
