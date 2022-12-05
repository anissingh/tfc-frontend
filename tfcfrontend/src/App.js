import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import EditProfile from "./pages/editprofile";
import Home from "./pages/home";
import ClosestStudios from "./pages/closest-studios";
import SubscriptionPlans from "./pages/subscription-plans";
import ViewProfile from "./pages/viewprofile";
import ViewStudio from "./pages/viewstudio";
import ViewBookings from "./pages/viewbookings";


function App() {

    return (
        <BrowserRouter>
            <Routes>
                  <Route path="/">
                      <Route path="" element={<Home />} />
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                      <Route path="profile/view" element={<ViewProfile />} />
                      <Route path="profile/edit" element={<EditProfile />} />
                      <Route path="profile/bookings" element={<ViewBookings />} />
                      <Route path="studios/closest" element={<ClosestStudios />} />
                      <Route path="memberships" element={<SubscriptionPlans />} />
                      <Route path="studios/:studioId/view" element={<ViewStudio />} />
                  </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
