import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PostsList from './pages/PostsList';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import PreviewPost from './pages/PreviewPost';
import TagsList from './pages/TagsList';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/new" element={<CreatePost />} />
            <Route path="posts/:id/edit" element={<EditPost />} />
            <Route path="posts/:id/preview" element={<PreviewPost />} />
            <Route path="tags" element={<TagsList />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
