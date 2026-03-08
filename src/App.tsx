import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import AuthPasswordReset from '@/pages/AuthPasswordReset'
import EmailVerify from '@/pages/EmailVerify'
import Dashboard from '@/pages/Dashboard'
import AgentList from '@/pages/AgentList'
import AgentBuilder from '@/pages/AgentBuilder'
import AgentPublish from '@/pages/AgentPublish'
import PublicChat from '@/pages/PublicChat'
import Demo from '@/pages/Demo'
import SessionList from '@/pages/SessionList'
import SessionViewer from '@/pages/SessionViewer'
import Templates from '@/pages/Templates'
import DashboardTemplates from '@/pages/DashboardTemplates'
import Webhooks from '@/pages/Webhooks'
import Billing from '@/pages/Billing'
import BillingHistory from '@/pages/BillingHistory'
import BillingCheckout from '@/pages/BillingCheckout'
import DashboardSettings from '@/pages/DashboardSettings'
import {
  AdminLayout,
  DashboardOverview,
  UsersManagement,
  QuotasAndDefaults,
  BillingOversight,
  SystemLogs,
  FeatureFlagsAndConfig,
  AnalyticsAndReporting,
} from '@/components/admin'
import Profile from '@/pages/Profile'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import Help from '@/pages/Help'
import NotFound from '@/pages/NotFound'
import ServerError from '@/pages/ServerError'

/** Redirects /password-reset/set?token=... to /auth/password-reset?token=... */
function RedirectPasswordResetSet() {
  const location = useLocation()
  const search = location.search?.length ? location.search : ''
  return <Navigate to={`/auth/password-reset${search}`} replace /> 
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/auth/password-reset" element={<AuthPasswordReset />} />
          <Route path="/password-reset" element={<Navigate to="/auth/password-reset" replace />} />
          <Route path="/password-reset/set" element={<RedirectPasswordResetSet />} />
          <Route path="/verify-email" element={<EmailVerify />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/agents" element={<AgentList />} />
          <Route path="/dashboard/agents/new" element={<AgentBuilder />} />
          <Route path="/dashboard/agents/:id" element={<AgentBuilder />} />
          <Route path="/dashboard/agents/:id/publish" element={<AgentPublish />} />
          <Route path="/dashboard/sessions" element={<SessionList />} />
          <Route path="/dashboard/sessions/:id" element={<SessionViewer />} />
          <Route path="/dashboard/templates" element={<DashboardTemplates />} />
          <Route path="/dashboard/webhooks" element={<Webhooks />} />
          <Route path="/dashboard/billing" element={<Billing />} />
          <Route path="/dashboard/billing/history" element={<BillingHistory />} />
          <Route path="/dashboard/billing/checkout" element={<BillingCheckout />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="quotas" element={<QuotasAndDefaults />} />
            <Route path="billing" element={<BillingOversight />} />
            <Route path="logs" element={<SystemLogs />} />
            <Route path="flags" element={<FeatureFlagsAndConfig />} />
            <Route path="analytics" element={<AnalyticsAndReporting />} />
          </Route>
          <Route path="/demo" element={<Demo />} />
          <Route path="/chat/:slug" element={<PublicChat />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/tos" element={<Terms />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<Help />} />
          <Route path="/pricing" element={<Landing />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
