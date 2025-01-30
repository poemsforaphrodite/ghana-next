"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "" });
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      if (err instanceof Error && err.message.includes('No authentication token found')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add user');
      }

      setNewUser({ username: "", email: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete user');
      }

      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Admin Dashboard</h1>
        
        <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Add New User</h2>
          <form onSubmit={addUser} className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="flex-grow bg-white"
            />
            <Input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="flex-grow bg-white"
            />
            <Input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="flex-grow bg-white"
            />
            <Select
              value={newUser.role}
              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">Add User</Button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">User List</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-700">ID</TableHead>
                <TableHead className="text-gray-700">Email</TableHead>
                <TableHead className="text-gray-700">Role</TableHead>
                <TableHead className="text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="text-gray-900">{user._id}</TableCell>
                  <TableCell className="text-gray-900">{user.email}</TableCell>
                  <TableCell className="text-gray-900">{user.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteUserId(user._id)}
                      className="bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={deleteUserId !== null} onOpenChange={() => setDeleteUserId(null)}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-gray-700">
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteUserId(null)} className="text-gray-700 border-gray-300">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteUserId && deleteUser(deleteUserId)}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}