BEGIN;
ALTER TABLE public.customer ADD active BOOL NOT NULL DEFAULT FALSE;
END;