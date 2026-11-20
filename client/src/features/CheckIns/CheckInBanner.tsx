import { Alert } from "@heroui/react";

export function CheckInBanner() {
  return (
    <Alert
      className="rounded-sm items-center border-default border-1"
      status="success"
    >
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Check in completed for today!</Alert.Title>
        <Alert.Description>
          Come back tomorrow to check in again.
        </Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
