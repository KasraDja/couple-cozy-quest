CREATE TABLE public.profiles (id uuid PRIMARY KEY, display_name text NOT NULL DEFAULT 'You', skin text NOT NULL DEFAULT 'peach', hair text NOT NULL DEFAULT 'dark', outfit text NOT NULL DEFAULT 'green', accessory text NOT NULL DEFAULT 'none', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated; GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id=auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id=auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id=auth.uid()) WITH CHECK (id=auth.uid());

CREATE TABLE public.couples (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invite_code text NOT NULL UNIQUE, created_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.couples TO authenticated; GRANT ALL ON public.couples TO service_role;
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.couple_members (couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE, user_id uuid NOT NULL, joined_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (couple_id,user_id), UNIQUE(user_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.couple_members TO authenticated; GRANT ALL ON public.couple_members TO service_role;
ALTER TABLE public.couple_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_couple_member(_couple_id uuid, _user_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.couple_members WHERE couple_id=_couple_id AND user_id=_user_id) $$;
CREATE POLICY "members see couple" ON public.couples FOR SELECT TO authenticated USING (public.is_couple_member(id, auth.uid()));
CREATE POLICY "members see members" ON public.couple_members FOR SELECT TO authenticated USING (public.is_couple_member(couple_id, auth.uid()));
CREATE POLICY "members see partner profile" ON public.profiles FOR SELECT TO authenticated USING (EXISTS(SELECT 1 FROM public.couple_members m WHERE m.user_id=profiles.id AND public.is_couple_member(m.couple_id,auth.uid())));

CREATE OR REPLACE FUNCTION public.create_couple(_code text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE _id uuid; BEGIN IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF; IF EXISTS(SELECT 1 FROM public.couple_members WHERE user_id=auth.uid()) THEN RAISE EXCEPTION 'Already in a couple'; END IF; IF _code !~ '^[A-Z0-9]{8}$' THEN RAISE EXCEPTION 'Invalid code'; END IF; INSERT INTO public.couples(invite_code,created_by) VALUES (_code,auth.uid()) RETURNING id INTO _id; INSERT INTO public.couple_members(couple_id,user_id) VALUES (_id,auth.uid()); RETURN _id; END $$;
CREATE OR REPLACE FUNCTION public.join_couple(_code text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE _id uuid; BEGIN IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF; IF EXISTS(SELECT 1 FROM public.couple_members WHERE user_id=auth.uid()) THEN RAISE EXCEPTION 'Already in a couple'; END IF; SELECT id INTO _id FROM public.couples WHERE invite_code=upper(trim(_code)); IF _id IS NULL THEN RAISE EXCEPTION 'Invite code not found'; END IF; IF (SELECT count(*) FROM public.couple_members WHERE couple_id=_id)>=2 THEN RAISE EXCEPTION 'This couple is full'; END IF; INSERT INTO public.couple_members(couple_id,user_id) VALUES (_id,auth.uid()); RETURN _id; END $$;
REVOKE ALL ON FUNCTION public.create_couple(text) FROM PUBLIC; REVOKE ALL ON FUNCTION public.join_couple(text) FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.create_couple(text), public.join_couple(text) TO authenticated;

CREATE TABLE public.ideas (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE, category text NOT NULL CHECK (category IN ('recipes','restaurants','watch','music','places','home','trips','events','videos')), title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200), note text NOT NULL DEFAULT '', link text, added_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ideas TO authenticated; GRANT ALL ON public.ideas TO service_role;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read ideas" ON public.ideas FOR SELECT TO authenticated USING (public.is_couple_member(couple_id,auth.uid()));
CREATE POLICY "members add ideas" ON public.ideas FOR INSERT TO authenticated WITH CHECK (public.is_couple_member(couple_id,auth.uid()) AND added_by=auth.uid());
CREATE POLICY "members edit ideas" ON public.ideas FOR UPDATE TO authenticated USING (public.is_couple_member(couple_id,auth.uid())) WITH CHECK (public.is_couple_member(couple_id,auth.uid()));
CREATE POLICY "members delete ideas" ON public.ideas FOR DELETE TO authenticated USING (public.is_couple_member(couple_id,auth.uid()));

CREATE TABLE public.dates (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE, idea_id uuid REFERENCES public.ideas(id) ON DELETE SET NULL, title text NOT NULL CHECK (length(title) BETWEEN 1 AND 200), happened_on date NOT NULL DEFAULT CURRENT_DATE, note text NOT NULL DEFAULT '', added_by uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dates TO authenticated; GRANT ALL ON public.dates TO service_role;
ALTER TABLE public.dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read dates" ON public.dates FOR SELECT TO authenticated USING (public.is_couple_member(couple_id,auth.uid()));
CREATE POLICY "members add dates" ON public.dates FOR INSERT TO authenticated WITH CHECK (public.is_couple_member(couple_id,auth.uid()) AND added_by=auth.uid() AND (idea_id IS NULL OR EXISTS(SELECT 1 FROM public.ideas WHERE id=idea_id AND couple_id=dates.couple_id)));
CREATE POLICY "members edit dates" ON public.dates FOR UPDATE TO authenticated USING (public.is_couple_member(couple_id,auth.uid())) WITH CHECK (public.is_couple_member(couple_id,auth.uid()) AND (idea_id IS NULL OR EXISTS(SELECT 1 FROM public.ideas WHERE id=idea_id AND couple_id=dates.couple_id)));
CREATE POLICY "members delete dates" ON public.dates FOR DELETE TO authenticated USING (public.is_couple_member(couple_id,auth.uid()));
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER couples_touch BEFORE UPDATE ON public.couples FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER ideas_touch BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER dates_touch BEFORE UPDATE ON public.dates FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();