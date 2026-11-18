import type { Activity } from "@health-tracker/shared";
import { Button } from "@heroui/react";
import { Card } from "@heroui/react/card";
import { useActivitiesMutation } from "@/queries/useActivitiesMutation";

export function Activity(activity: Activity) {
  const { deleteActivity } = useActivitiesMutation();

  const handleDelete = async () => {
    try {
      await deleteActivity.mutateAsync(activity.id);
    } catch (error) {
      console.error(`Failed to delete activity with ID: ${activity.id}`, error);
    }
  };

  return (
    <Card>
      <p>ID: {activity.id}</p>
      <p>Date: {activity.date}</p>
      <p>Type: {activity.type}</p>
      <p>Duration: {activity.durationMinutes} minutes</p>
      <p>Effort: {activity.effort}</p>

      <Button onClick={handleDelete} isPending={deleteActivity.isPending}>
        Delete
      </Button>
    </Card>
  );
}
