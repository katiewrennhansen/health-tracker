import type { Activity } from "@health-tracker/shared";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Button, Table } from "@heroui/react";
import { format, parseISO } from "date-fns";
import { useActivitiesMutation } from "@/queries/useActivitiesMutation";

interface ActivitiesTableProps {
  activities: Activity[];
  handleOpenActivityModal: (activity: Activity) => void;
}

/** The user's activities, one row each, with a delete button per row. */
export function ActivitiesTable({
  activities,
  handleOpenActivityModal,
}: ActivitiesTableProps) {
  const { deleteActivity } = useActivitiesMutation();

  const handleDelete = (id: string) => {
    deleteActivity.mutate(id);
  };

  return (
    <Table className="rounded-sm">
      <Table.ScrollContainer>
        <Table.Content aria-label="Activities" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Date</Table.Column>
            <Table.Column>Type</Table.Column>
            <Table.Column>Duration</Table.Column>
            <Table.Column>Effort</Table.Column>
            <Table.Column className="text-end">Actions</Table.Column>
          </Table.Header>
          <Table.Body
            className="rounded-sm"
            renderEmptyState={() => (
              <p className="py-6 text-center text-sm text-muted">
                No activities yet.
              </p>
            )}
          >
            {activities.map((activity) => (
              <Table.Row key={activity.id} id={activity.id}>
                <Table.Cell>
                  {format(parseISO(activity.date), "MMM do yyyy")}
                </Table.Cell>
                <Table.Cell className="capitalize">{activity.type}</Table.Cell>
                <Table.Cell>{activity.durationMinutes} min</Table.Cell>
                <Table.Cell>{activity.effort}/10</Table.Cell>
                <Table.Cell className="flex gap-2 justify-end">
                  <Button
                    isIconOnly
                    aria-label={`Edit ${activity.type} on ${activity.date}`}
                    size="sm"
                    variant="outline"
                    onPress={() => handleOpenActivityModal(activity)}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    isIconOnly
                    aria-label={`Delete ${activity.type} on ${activity.date}`}
                    size="sm"
                    variant="danger-soft"
                    onPress={() => {
                      handleDelete(activity.id);
                    }}
                    isPending={
                      deleteActivity.isPending &&
                      deleteActivity.variables === activity.id
                    }
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
