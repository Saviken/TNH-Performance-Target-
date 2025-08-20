import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { DEPARTMENTS } from '../contexts/AuthContext.jsx';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayoutFixed.jsx')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout.jsx')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard.jsx')));
const Icons = Loadable(lazy(() => import('../views/icons/Icons.jsx')));
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage.jsx')));
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow.jsx')));
const Error = Loadable(lazy(() => import('../views/authentication/Error.jsx')));
const Register = Loadable(lazy(() => import('../views/authentication/Register.jsx')));
const Login = Loadable(lazy(() => import('../views/authentication/Login.jsx')));
const Dmsr = Loadable(lazy(() => import("../views/Forms/dmsr.jsx")));

/* ****Division Pages***** */
const Finance = Loadable(lazy(() => import('../pages/finance.jsx')));
const MedicalServices = Loadable(lazy(() => import('../pages/medical-services.jsx')));
const StrategyInnovation = Loadable(lazy(() => import('../pages/strategy-innovation.jsx')));
const ICT = Loadable(lazy(() => import('../pages/ict.jsx')));
const NursingServices = Loadable(lazy(() => import('../pages/nursing-services.jsx')));
const SupplyChain = Loadable(lazy(() => import('../pages/supply-chain.jsx')));

/* ****Strategic Objectives Pages***** */
const FinanceObjectives = Loadable(lazy(() => import('../pages/strategic-objectives/FinanceObjectives.jsx')));
const MedicalServicesObjectives = Loadable(lazy(() => import('../pages/strategic-objectives/MedicalServicesObjectives.jsx')));
const StrategyInnovationObjectives = Loadable(lazy(() => import('../pages/strategic-objectives/StrategyInnovationObjectives.jsx')));

/* ****Admin Pages***** */
const UserManagement = Loadable(lazy(() => import('../pages/admin/UserManagement.jsx')));

/* ****Department Pages***** */
const Operation = Loadable(lazy(() => import('../pages/operation.jsx')));
const LegalKHA = Loadable(lazy(() => import('../pages/legal-kha.jsx')));
const Security = Loadable(lazy(() => import('../pages/security.jsx')));
const InternalAudit = Loadable(lazy(() => import('../pages/internal-audit.jsx')));
const RiskCompliance = Loadable(lazy(() => import('../pages/risk-compliance.jsx')));
const Engineering = Loadable(lazy(() => import('../pages/engineering.jsx')));
const HealthScience = Loadable(lazy(() => import('../pages/health-science.jsx')));
const HumanResource = Loadable(lazy(() => import('../pages/human-resource.jsx')));
const PerformanceHistoryQuarter = Loadable(lazy(() => import('../pages/performance-history-quarter.jsx')));

const Router = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
  
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      
      /* ****Admin Routes (Protected)***** */
      { 
        path: '/admin/user-management', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.ADMIN}>
            <UserManagement />
          </ProtectedRoute>
        )
      },
      
      /* ****Division Routes (Protected)***** */
      { 
        path: '/pages/finance', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.FINANCE}>
            <Finance />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/medical-services', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.MEDICAL_SERVICES}>
            <MedicalServices />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/strategy-innovation', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.STRATEGY_INNOVATION}>
            <StrategyInnovation />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/ict', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.ICT}>
            <ICT />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/nursing-services', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.NURSING_SERVICES}>
            <NursingServices />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/supply-chain', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.SUPPLY_CHAIN}>
            <SupplyChain />
          </ProtectedRoute>
        )
      },
      
      /* ****Strategic Objectives Routes (Protected)***** */
      { 
        path: '/strategic-objectives/finance', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.FINANCE}>
            <FinanceObjectives />
          </ProtectedRoute>
        )
      },
      { 
        path: '/strategic-objectives/medical-services', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.MEDICAL_SERVICES}>
            <MedicalServicesObjectives />
          </ProtectedRoute>
        )
      },
      { 
        path: '/strategic-objectives/strategy-innovation', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.STRATEGY_INNOVATION}>
            <StrategyInnovationObjectives />
          </ProtectedRoute>
        )
      },
      
      /* ****Department Routes (Protected)***** */
      { 
        path: '/pages/operation', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.OPERATION}>
            <ErrorBoundary><Operation /></ErrorBoundary>
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/legal-kha', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.LEGAL_KHA}>
            <LegalKHA />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/security', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.SECURITY}>
            <Security />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/internal-audit', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.INTERNAL_AUDIT}>
            <InternalAudit />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/risk-compliance', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.RISK_COMPLIANCE}>
            <RiskCompliance />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/engineering', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.ENGINEERING}>
            <Engineering />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/health-science', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.HEALTH_SCIENCE}>
            <HealthScience />
          </ProtectedRoute>
        )
      },
      { 
        path: '/pages/human-resource', 
        exact: true, 
        element: (
          <ProtectedRoute requiredDepartment={DEPARTMENTS.HUMAN_RESOURCE}>
            <HumanResource />
          </ProtectedRoute>
        )
      },
      {
        path: '/performance/history/:year/q:quarter',
        exact: true,
        element: (
          <ProtectedRoute>
            <PerformanceHistoryQuarter />
          </ProtectedRoute>
        )
      },
      
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;