CREATE TABLE source_exclusions (
 source_key text PRIMARY KEY NOT NULL,
 owner_id text NOT NULL,
 reference_id text NOT NULL,
 last_seen_at text NOT NULL,
 missing_confirmed integer NOT NULL DEFAULT 0,
 cover_key text
);
--> statement-breakpoint
ALTER TABLE discovery_lists ADD scan_started_at text;
--> statement-breakpoint
ALTER TABLE discovery_lists ADD scan_tracking integer NOT NULL DEFAULT 0;
