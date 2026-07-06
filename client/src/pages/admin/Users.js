import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaBan, FaCheck, FaSpinner, FaSearch, FaTimes, FaUserShield, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  fetchAllUsers,
  updateUserStatus,
  updateUserRole,
  clearOperationState
} from '../../redux/slices/adminSlice';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const {
    users,
    usersLoading,
    usersError,
    operationLoading,
    operationSuccess,
    operationError
  } = useSelector(state => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (operationSuccess) {
      toast.success(operationSuccess);
      dispatch(clearOperationState());
      setShowEditModal(false);
      dispatch(fetchAllUsers({ limit: 100 }));
    }
    if (operationError) {
      toast.error(operationError);
      dispatch(clearOperationState());
    }
  }, [operationSuccess, operationError, dispatch]);

  const handleToggleStatus = (user) => {
    const newStatus = !user.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      dispatch(updateUserStatus({ userId: user._id, isActive: newStatus }));
    }
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowEditModal(true);
  };

  const handleUpdateRole = () => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }

    if (selectedUser.role === 'admin' && newRole !== 'admin') {
      if (!window.confirm('Warning: You are removing admin privileges. Continue?')) {
        return;
      }
    }

    dispatch(updateUserRole({ userId: selectedUser._id, role: newRole }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin - Evergreen Depot Market</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {usersError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            {usersError}
          </div>
        )}

        {usersLoading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-4xl text-green-600" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            {user.role === 'admin' ? (
                              <FaUserShield className="text-green-600" />
                            ) : (
                              <FaUser className="text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.phone || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.city ? `${user.city}, ${user.province || ''}`.trim() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.isActive !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                        {user.emailVerified && (
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Role"
                            disabled={operationLoading}
                          >
                            <FaEdit />
                          </button>
                          {user.isActive !== false ? (
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="text-red-600 hover:text-red-800"
                              title="Deactivate User"
                              disabled={operationLoading}
                            >
                              <FaBan />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="text-green-600 hover:text-green-800"
                              title="Activate User"
                              disabled={operationLoading}
                            >
                              <FaCheck />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit User Role Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit User Role</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">User: <span className="font-semibold">{selectedUser.name}</span></p>
                  <p className="text-sm text-gray-600 mb-1">Email: <span className="font-semibold">{selectedUser.email}</span></p>
                  <p className="text-sm text-gray-600">Current Role: <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedUser.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedUser.role}
                  </span></p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select New Role *</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {newRole === 'admin' && selectedUser.role !== 'admin' && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 text-sm">
                      <strong>Warning:</strong> Granting admin privileges will give this user full access to the admin panel and all administrative functions.
                    </div>
                  )}

                  {newRole !== 'admin' && selectedUser.role === 'admin' && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                      <strong>Warning:</strong> Removing admin privileges will revoke all administrative access for this user.
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateRole}
                    disabled={operationLoading || newRole === selectedUser.role}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {operationLoading && <FaSpinner className="animate-spin" />}
                    Update Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Count Summary */}
        {!usersLoading && users.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">{users.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.isActive !== false).length}
                </div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-sm text-gray-600">Admins</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.emailVerified).length}
                </div>
                <div className="text-sm text-gray-600">Verified Emails</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
