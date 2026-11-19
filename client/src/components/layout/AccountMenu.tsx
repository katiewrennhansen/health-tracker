import { useClerk, useUser } from "@clerk/react";
import { Avatar, Dropdown } from "@heroui/react";

/** Avatar with the user's initials; opens a menu to manage the Clerk account or sign out. */
export function AccountMenu({ isExpanded }: { isExpanded: boolean }) {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const initials =
    [user?.firstName, user?.lastName]
      .map((name) => name?.[0] ?? "")
      .join("")
      .toUpperCase() || "?";

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={isExpanded ? undefined : "Account"}
        className={`flex w-full items-center gap-3 rounded-xl py-2 text-left hover:bg-default ${
          isExpanded ? "px-2" : "justify-center"
        }`}
      >
        <Avatar className="shrink-0">
          {user?.hasImage && <Avatar.Image src={user.imageUrl} alt="" />}
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
        {isExpanded && <span className="font-medium">Account</span>}
      </Dropdown.Trigger>
      <Dropdown.Popover placement="top start">
        <Dropdown.Menu
          aria-label="Account"
          onAction={(key) => {
            if (key === "profile") openUserProfile();
            if (key === "sign-out") void signOut();
          }}
        >
          <Dropdown.Item id="profile" textValue="Manage account">
            Manage account
          </Dropdown.Item>
          <Dropdown.Item id="sign-out" textValue="Sign out" variant="danger">
            Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
