
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS morning_prompt_time time NOT NULL DEFAULT '08:00',
  ADD COLUMN IF NOT EXISTS onboarded_at timestamptz;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Backfill completed_at for already-done tasks so streaks work immediately
UPDATE public.tasks SET completed_at = created_at WHERE done = true AND completed_at IS NULL;
