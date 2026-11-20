import clsx from "clsx";
import { useClerk, useUser } from "@clerk/react";
import { Avatar, Dropdown, type Key } from "@heroui/react";

/** Avatar with the user's initials; opens a menu to manage the Clerk account or sign out. */
export function AccountMenu({ isExpanded }: { isExpanded: boolean }) {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  const handleSelect = (key: Key) => {
    if (key === "profile") openUserProfile();
    if (key === "sign-out") void signOut();
  };

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label="Account"
        className={clsx(
          "flex w-full items-center gap-3",
          !isExpanded && "justify-center",
        )}
      >
        <Avatar className="shrink-0">
          {user?.hasImage && (
            <Avatar.Image src={user.imageUrl} alt="User avatar" />
          )}
          <Avatar.Fallback>{user?.firstName}</Avatar.Fallback>
        </Avatar>
        {isExpanded && <span className="font-medium">Account</span>}
      </Dropdown.Trigger>
      <Dropdown.Popover placement="top start" className="rounded-sm">
        <Dropdown.Menu
          aria-label="Account"

          onAction={handleSelect}
        >
          <Dropdown.Item
            id="profile"
            textValue="Manage account"
            className="rounded-sm"
          >
            Manage account
          </Dropdown.Item>
          <Dropdown.Item
            id="sign-out"
            textValue="Sign out"
            variant="danger"
            className="rounded-sm"
          >
            Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
