import type { CheckIn } from "@health-tracker/shared";
import { Card, Table } from "@heroui/react";
import { RatingChip } from "@/ui/RatingChip";
import { formatDate, hours } from "@/utils/utils";

type PastWeekTableProps = {
  /** The user's check-ins, newest first (as the API returns them). */
  checkIns: CheckIn[];
};

/** The last seven check-ins, plus the average sleep over the last fourteen. */
export function PastWeekTable({ checkIns }: PastWeekTableProps) {
  const pastWeek = checkIns.slice(0, 7);
  const lastFortnight = checkIns.slice(0, 14);
  const usualSleepMinutes = lastFortnight.length
    ? lastFortnight.reduce((total, c) => total + c.sleepMinutes, 0) /
      lastFortnight.length
    : null;

  return (
    <Card className="rounded-sm">
      <Card.Header>
        <Card.Title>Past week</Card.Title>
      </Card.Header>
      <Card.Content>
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Past week of check-ins">
              <Table.Header>
                <Table.Column isRowHeader>Day</Table.Column>
                <Table.Column className="text-end">Sleep</Table.Column>
                <Table.Column className="text-end">Soreness</Table.Column>
                <Table.Column className="text-end">Mood</Table.Column>
                <Table.Column className="text-end">Energy</Table.Column>
                <Table.Column className="text-end">Stress</Table.Column>
              </Table.Header>
              <Table.Body
                className="rounded-sm"
                renderEmptyState={() => (
                  <p className="py-6 text-center text-sm text-muted">
                    No check-ins yet.
                  </p>
                )}
              >
                {pastWeek.map((checkIn) => (
                  <Table.Row key={checkIn.id} id={checkIn.id}>
                    <Table.Cell>{formatDate(checkIn.date)}</Table.Cell>
                    <Table.Cell className="text-end">
                      {hours(checkIn.sleepMinutes)}
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      <RatingChip value={checkIn.soreness} reverse />
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      <RatingChip value={checkIn.mood} />
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      <RatingChip value={checkIn.energy} />
                    </Table.Cell>
                    <Table.Cell className="text-end">
                      <RatingChip value={checkIn.stress} reverse />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card.Content>
      {usualSleepMinutes !== null && (
        <Card.Footer className="text-sm text-muted">
          {`Your usual sleep: ${hours(usualSleepMinutes)} (${lastFortnight.length}-day average)`}
        </Card.Footer>
      )}
    </Card>
  );
}
