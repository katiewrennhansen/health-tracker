import type { Activity } from "@health-tracker/shared";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Card, Table } from "@heroui/react";
import { useActivitiesMutation } from "@/queries/useActivitiesMutation";
import { formatDate } from "@/utils/utils";

type ActivitiesTableProps = {
  activities: Activity[];
  handleOpenActivityModal: (activity: Activity) => void;
};

/** The user's activities in a card, one row each, with edit and delete buttons per row. */
export function ActivitiesTable({
  activities,
  handleOpenActivityModal,
}: ActivitiesTableProps) {
  const { deleteActivity } = useActivitiesMutation();

  const handleDelete = (id: string) => {
    deleteActivity.mutate(id);
  };

  return (
    <Card className="rounded-sm">
      <Card.Header>
        <Card.Title>Activities</Card.Title>
      </Card.Header>
      <Card.Content>
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Activities" className="min-w-[600px]">
              <Table.Header>
                <Table.Column isRowHeader>Date</Table.Column>
                <Table.Column>Type</Table.Column>
                <Table.Column className="text-end">Duration</Table.Column>
                <Table.Column className="text-end">Effort</Table.Column>
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
                    <Table.Cell>{formatDate(activity.date)}</Table.Cell>
                    <Table.Cell className="capitalize">
                      {activity.type}
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      {activity.durationMinutes} min
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      {activity.effort} / 10
                    </Table.Cell>
                    <Table.Cell className="flex justify-end gap-2">
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
                        onPress={() => handleDelete(activity.id)}
                        // Only the row being deleted shows as pending.
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
      </Card.Content>
    </Card>
  );
}
