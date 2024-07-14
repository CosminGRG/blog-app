import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import CreatePost from '../pages/CreatePost';
import EditPost from '../pages/EditPost';
import Post from '../pages/Post';
import BlockAuthRoutes from './BlockAuthRoutes';
import AdminProtectedRoute from './AdminProtectedRoutes';
import PostsByTag from '../pages/PostsByTag';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/create-post"
        element={
          <AdminProtectedRoute allowedRoles={['Admin']}>
            <CreatePost />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <AdminProtectedRoute allowedRoles={['Admin']}>
            <EditPost />
          </AdminProtectedRoute>
        }
      />

      <Route path="/post/:id" element={<Post />} />
      <Route path="/posts/tag/:tagName" element={<PostsByTag />} />

      <Route
        path="/login"
        element={
          <BlockAuthRoutes>
            <Login />
          </BlockAuthRoutes>
        }
      />
      <Route
        path="/register"
        element={
          <BlockAuthRoutes>
            <Register />
          </BlockAuthRoutes>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
