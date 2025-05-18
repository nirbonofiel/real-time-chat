import React, { useEffect, useState } from "react";
import { retrieveUsers } from "../../api/apiActions";
import { useAuth } from "../../context/AuthContext";
import {
  Avatar,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

type UserListProps = {
  handleRecipientChange: (username: string) => void,
  recipient?: string
}

const UserList: React.FC<UserListProps> = ({handleRecipientChange, recipient}) => {
  const { authToken }: any = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if(authToken){
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    const users = await retrieveUsers("/users/users", authToken);
    setUsers(users);
  };

  return (
    <Card sx={{width: "100%", maxWidth: 250, paddingTop: '22px'}} >
      <List
        dense
        sx={{bgcolor: "background.paper" }}
      >
        {users.map((user: any) => (
          <ListItem
            key={user.id}
            onClick={() => {
              handleRecipientChange(user.username);
            }}
          >
            <ListItemButton selected={user.username === recipient}>
              <ListItemAvatar>
                <Avatar alt={user.username} src={user.avatarUrl} />
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default UserList;
