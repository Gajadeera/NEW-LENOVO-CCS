import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';


// Public pages
import Signup from './pages/Signup';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Auth pages
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// User management pages
import UserList from './pages/User/Users';
import EditUser from './pages/User/UpdateUser';
import DeleteUser from './pages/User/DeleteUser';
import UserSkills from './pages/User/UserSkills';
import UserView from './pages/User/UserView';

// Role-specific pages
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import TechnicianDashboard from './pages/Dashboard/TechnicianDashboard';
import ManagerDashboard from './pages/Dashboard/ManagerDashboard';
import CoordinatorDashboard from './pages/Dashboard/CoordinatorDashboard';
import PartsTeamDashboard from './pages/Dashboard/PartsTeamDashboard';

// Common pages
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';
import ProfileModal from './components/Profile/ProfileModal';

// Job management pages
import JobList from './pages/Job/JobList';
import CreateJobModal from './pages/Job/CreateJobModal';
import EditJob from './pages/Job/EditJob';
import AssignJob from './pages/Job/AssignJob';
import UpdateJobStatus from './pages/Job/UpdateJobStatus';
import JobHistory from './pages/Job/JobHistory';
import JobsByStatus from './pages/Job/JobsByStatus';
import JobsByCustomer from './pages/Job/JobsByCustomer';


// Customer management pages
import CustomerList from './pages/Customer/CustomerList';
import CreateCustomer from './pages/Customer/CreateCustomer';
import ViewCustomer from './pages/Customer/ViewCustomer';
import EditCustomer from './pages/Customer/EditCustomer';
import DeleteCustomer from './pages/Customer/DeleteCustomer';
import CustomersByLocation from './pages/Customer/CustomersByLocation';

// Device management pages
import DeviceList from './pages/Device/DeviceList';
import CreateDevice from './pages/Device/AddDeviceModal';
import ViewDevice from './pages/Device/ViewDevice';
import EditDevice from './pages/Device/EditDevice';
import DeleteDevice from './pages/Device/DeleteDevice';
import DevicesByType from './pages/Device/DevicesByType';
import DeviceServiceHistory from './pages/Device/DeviceServiceHistory';

// Inventory management pages
import InventoryList from './pages/Inventory/InventoryList';
import CreateInventoryItem from './pages/Inventory/CreateInventoryItem';
import ViewInventoryItem from './pages/Inventory/ViewInventoryItem';
import EditInventoryItem from './pages/Inventory/EditInventoryItem';
import LowStockItems from './pages/Inventory/LowStockItems';

// Workshop pages
import WorkshopRepairs from './pages/Workshop/WorkshopRepairs';
import CreateWorkshopRepair from './pages/Workshop/CreateWorkshopRepair';
import WorkshopRepairDetail from './pages/Workshop/WorkshopRepairDetail';

// Parts management pages
import PartsRequests from './pages/Parts/PartsRequests';
import CreatePartsRequest from './pages/Parts/CreatePartsRequest';
import PartsRequestDetail from './pages/Parts/PartsRequestDetail';

// Feedback & signatures
import CustomerFeedback from './pages/Feedback/CustomerFeedback';
import CustomerSignatures from './pages/Signatures/CustomerSignatures';

// System pages
import Notifications from './pages/System/Notifications';
import JobUpdates from './pages/System/JobUpdates';
import ViewJob from './pages/Job/ViewJob';


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes className="min-h-screen bg-antiquewhite">
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ========== AUTHENTICATED COMMON ROUTES ========== */}
          <Route path="/profile" element={<PrivateRoute><ProfileModal /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

          {/* ========== DASHBOARD ========== */}
          <Route path="/AdminDashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/technicianDashboard" element={<PrivateRoute><TechnicianDashboard /></PrivateRoute>} />
          <Route path="/managerDashboard" element={<PrivateRoute><ManagerDashboard /></PrivateRoute>} />
          <Route path="/coordinatorDashboard" element={<PrivateRoute><CoordinatorDashboard /></PrivateRoute>} />
          <Route path="/partsTeamDashboard" element={<PrivateRoute><PartsTeamDashboard /></PrivateRoute>} />

          {/* ========== USER MANAGEMENT ========== */}
          <Route path="/users" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><UserList /></PrivateRoute>} />
          <Route path="/users/:id" element={<PrivateRoute roles={['admin', 'manager']}><UserView /></PrivateRoute>} />
          <Route path="/users/signup" element={<PrivateRoute roles={['admin', 'manager']}><Signup /></PrivateRoute>} />
          <Route path="/users/:id/edit" element={<PrivateRoute roles={['admin', 'manager']}><EditUser /></PrivateRoute>} />
          <Route path="/users/:id/delete" element={<PrivateRoute roles={['admin', 'manager']}><DeleteUser /></PrivateRoute>} />
          <Route path="/users/:id/skills" element={<PrivateRoute roles={['admin', 'manager']}><UserSkills /></PrivateRoute>} />
          <Route path="/users/role/:role" element={<PrivateRoute roles={['admin', 'manager']}><UserList /></PrivateRoute>} />

          {/* ========== JOB MANAGEMENT ========== */}
          <Route path="/jobs" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><JobList /></PrivateRoute>} />
          <Route path="/jobs/create" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><CreateJobModal /></PrivateRoute>} />
          <Route path="/jobs/:id" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><ViewJob /></PrivateRoute>} />
          <Route path="/jobs/:id/edit" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><EditJob /></PrivateRoute>} />
          <Route path="/jobs/:id/assign" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><AssignJob /></PrivateRoute>} />
          <Route path="/jobs/:id/status" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><UpdateJobStatus /></PrivateRoute>} />
          <Route path="/jobs/:id/history" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><JobHistory /></PrivateRoute>} />
          <Route path="/jobs/:id/updates" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><JobUpdates /></PrivateRoute>} />
          <Route path="/jobs/customer/:customerId" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><JobsByCustomer /></PrivateRoute>} />
          <Route path="/jobs/status/:status" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><JobsByStatus /></PrivateRoute>} />

          {/* ========== CUSTOMER MANAGEMENT ========== */}
          <Route path="/customers" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><CustomerList /></PrivateRoute>} />
          <Route path="/customers/create" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><CreateCustomer /></PrivateRoute>} />
          <Route path="/customers/:customerId" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><ViewCustomer /></PrivateRoute>} />
          <Route path="/customers/:customerId/edit" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><EditCustomer /></PrivateRoute>} />
          <Route path="/customers/:customerId/delete" element={<PrivateRoute roles={['admin', 'manager']}><DeleteCustomer /></PrivateRoute>} />
          <Route path="/customers/location/:location" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><CustomersByLocation /></PrivateRoute>} />

          {/* ========== DEVICE MANAGEMENT ========== */}
          <Route path="/devices" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><DeviceList /></PrivateRoute>} />
          <Route path="/devices/create" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><CreateDevice /></PrivateRoute>} />
          <Route path="/devices/:id" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><ViewDevice /></PrivateRoute>} />
          <Route path="/devices/:id/edit" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><EditDevice /></PrivateRoute>} />
          <Route path="/devices/:id/delete" element={<PrivateRoute roles={['admin', 'manager']}><DeleteDevice /></PrivateRoute>} />
          <Route path="/devices/type/:type" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><DevicesByType /></PrivateRoute>} />
          <Route path="/devices/:id/service-history" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><DeviceServiceHistory /></PrivateRoute>} />

          {/* ========== INVENTORY MANAGEMENT ========== */}
          <Route path="/inventory" element={<PrivateRoute roles={['admin', 'manager', 'parts_team']}><InventoryList /></PrivateRoute>} />
          <Route path="/inventory/create" element={<PrivateRoute roles={['admin', 'manager', 'parts_team']}><CreateInventoryItem /></PrivateRoute>} />
          <Route path="/inventory/:itemId" element={<PrivateRoute roles={['admin', 'manager', 'parts_team']}><ViewInventoryItem /></PrivateRoute>} />
          <Route path="/inventory/:itemId/edit" element={<PrivateRoute roles={['admin', 'manager', 'parts_team']}><EditInventoryItem /></PrivateRoute>} />
          <Route path="/inventory/low-stock" element={<PrivateRoute roles={['admin', 'manager', 'parts_team']}><LowStockItems /></PrivateRoute>} />

          {/* ========== WORKSHOP MANAGEMENT ========== */}
          <Route path="/workshop-repairs" element={<PrivateRoute roles={['admin', 'manager', 'technician']}><WorkshopRepairs /></PrivateRoute>} />
          <Route path="/workshop-repairs/create" element={<PrivateRoute roles={['admin', 'manager', 'technician']}><CreateWorkshopRepair /></PrivateRoute>} />
          <Route path="/workshop-repairs/:repairId" element={<PrivateRoute roles={['admin', 'manager', 'technician']}><WorkshopRepairDetail /></PrivateRoute>} />
          <Route path="/workshop-repairs/status/:status" element={<PrivateRoute roles={['admin', 'manager', 'technician']}><WorkshopRepairs /></PrivateRoute>} />

          {/* ========== PARTS REQUESTS ========== */}
          <Route path="/parts-requests" element={<PrivateRoute roles={['admin', 'manager', 'technician', 'parts_team']}><PartsRequests /></PrivateRoute>} />
          <Route path="/parts-requests/create" element={<PrivateRoute roles={['admin', 'manager', 'technician']}><CreatePartsRequest /></PrivateRoute>} />
          <Route path="/parts-requests/:requestId" element={<PrivateRoute roles={['admin', 'manager', 'technician', 'parts_team']}><PartsRequestDetail /></PrivateRoute>} />

          {/* ========== FEEDBACK & SIGNATURES ========== */}
          <Route path="/jobs/:id/feedback" element={<PrivateRoute roles={['admin', 'manager', 'coordinator']}><CustomerFeedback /></PrivateRoute>} />
          <Route path="/jobs/:id/signatures" element={<PrivateRoute roles={['admin', 'manager', 'coordinator', 'technician']}><CustomerSignatures /></PrivateRoute>} />

          {/* ========== CATCH-ALL ROUTE ========== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;