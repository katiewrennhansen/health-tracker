import type { Activity } from "@health-tracker/shared";
import { Button } from "@heroui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Card } from "@heroui/react/card";
import { format, parseISO } from "date-fns";
import { useActivitiesMutation } from "@/queries/useActivitiesMutation";

export function Activity(activity: Activity) {
  const { deleteActivity } = useActivitiesMutation();

  const handleDelete = async () => {
    const activityId = activity.id;
    if (!activityId) {
      console.error(`Activity ID is missing`);
      return;
    }

    try {
      await deleteActivity.mutateAsync(activityId);
      alert(`Activity deleted successfully`);
    } catch {
      console.error(`Failed to delete activity`);
      alert(`Failed to delete activity`);
    }
  };

  return (
    <Card>
      <Card.Content className="flex gap-2 flex-row justify-between">
        <div>
          <h3 className="capitalize text-lg font-semibold">{activity.type}</h3>
          <p>Date: {format(parseISO(activity.date), "MMM do yyyy")}</p>
          <p>Duration: {activity.durationMinutes} minutes</p>
          <p>Effort: {activity.effort}</p>
        </div>
        <Button
          variant="danger"
          onClick={handleDelete}
          isPending={deleteActivity.isPending}
        >
          <TrashIcon />
        </Button>
      </Card.Content>
    </Card>
  );
}
