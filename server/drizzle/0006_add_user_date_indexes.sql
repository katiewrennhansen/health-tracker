CREATE INDEX "activities_user_date_idx" ON "activities" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "alcohol_user_date_idx" ON "alcohol" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "illnesses_user_start_date_idx" ON "illnesses" USING btree ("user_id","start_date");--> statement-breakpoint
CREATE INDEX "injuries_user_start_date_idx" ON "injuries" USING btree ("user_id","start_date");--> statement-breakpoint
CREATE INDEX "travel_user_start_date_idx" ON "travel" USING btree ("user_id","start_date");