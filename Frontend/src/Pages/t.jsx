const PrivateRoute = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    console.log("user : ", isAuthenticated);
    const isAdminAuthenticated = useSelector((state) => state.auth.isAdminAuthenticated);
    console.log("admin : ", isAdminAuthenticated);
    if (isAdminAuthenticated) {
      return <Dashboard />;
    } else if (isAuthenticated) {
      return <Home />;
    } else {
      return <Login />;
    }
  };
  
  const PublicRoute = ({ element }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isAdminAuthenticated = useSelector((state) => state.auth.isAdminAuthenticated);
    if (isAdminAuthenticated && element) {
      return element;
    }
    if (isAdminAuthenticated) {
      return <Navigate to="/dashboard" />;
    }
    if (isAuthenticated) {
      return <Navigate to="/" />;
    }
  
    return element;
  };
  
  export default function App() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute />} />
            <Route path="/register" element={<PublicRoute element={<Register />} />} />
            <Route path="/login" element={<PublicRoute element={<Login />} />} />
            <Route path="/edituser/:userId" element={<PublicRoute element={<EditUser />} />} />
            <Route path="/createuser" element={<PublicRoute element={<CreateUser />} />} />
            <Route path="/edituserhome/:userId" element={<EditUserHome />} />
            <Route path="/dashboard" element={<PrivateRoute />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  }

  <Route path="/edituserhome/:userId" element={isUserAuthenticated?<EditUserHome />:<Signin/>} />               