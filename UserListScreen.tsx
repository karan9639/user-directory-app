import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, ActivityIndicator, TouchableOpacity, TextInput, Button, Image } from 'react-native';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  picture?: string; // Optional field for profile picture
}

const UserListScreen = ({ navigation }: { navigation: any }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'email'>('name'); // Sort by name or email

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    filterUsers(searchQuery);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get<User[]>(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=10`);
      if (response.data.length < 10) setHasMore(false);
      setUsers((prevUsers) => [...prevUsers, ...response.data]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (criteria: 'name' | 'email') => {
    setSortBy(criteria);
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  const filterUsers = (query: string) => {
    if (query === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity onPress={() => navigation.navigate('UserDetails', { userId: item.id })}>
      <View style={{ padding: 15, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: `https://picsum.photos/200/200?random=${item.id}` }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
        <View>
          <Text style={{ fontSize: 18 }}>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 8 }}
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
        <Button title="Sort by Name" onPress={() => handleSort('name')} />
        <Button title="Sort by Email" onPress={() => handleSort('email')} />
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      />
    </View>
  );
};

export default UserListScreen;
