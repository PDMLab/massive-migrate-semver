BEGIN;
ALTER TABLE public.customer ADD active BOOL NOT NULL;
END;