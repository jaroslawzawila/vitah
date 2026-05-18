import { getUsers } from "../../actions/users";
import { UsersClient } from "./UsersClient";

export default async function UsersPage() {
  const userList = await getUsers();
  return <UsersClient users={userList} />;
}
