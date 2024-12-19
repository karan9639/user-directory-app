import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
  };
}

const UserDetailsScreen = ({ route }: { route: any }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
      setUser(response.data as User);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!user) {
    return <Text>User not found</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>{user.name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Address: {user.address.street}, {user.address.city}, {user.address.zipcode}</Text>
      <Text>Company: {user.company.name}</Text>
    </View>
  );
};

export default UserDetailsScreen;

