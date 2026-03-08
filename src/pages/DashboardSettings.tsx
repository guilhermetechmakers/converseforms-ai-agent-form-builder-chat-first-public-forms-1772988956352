import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Link } from 'react-router-dom'
import {
  User,
  Mail,
  Webhook,
  Cpu,
  HardDrive,
  Shield,
} from 'lucide-react'
import { toast } from 'sonner'

export default function DashboardSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [defaultRetries, setDefaultRetries] = useState(3)
  const [llmModel, setLlmModel] = useState('gpt-4o-mini')
  const [retentionDays, setRetentionDays] = useState(90)
  const [saving, setSaving] = useState(false)

  const handleSaveAccount = async () => {
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      toast.success('Account settings saved')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEmail = async () => {
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      toast.success('Email preferences saved')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveWebhookDefaults = async () => {
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      toast.success('Webhook defaults saved')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLLM = async () => {
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      toast.success('LLM defaults saved')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveRetention = async () => {
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 300))
      toast.success('Data retention policy saved')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-semibold text-foreground">Settings &amp; Preferences</h1>
            <p className="text-muted-foreground">
              Account, email, webhooks, LLM defaults, storage, and data retention.
            </p>
          </div>
          <div className="p-6 sm:p-8 max-w-3xl">
            <Tabs defaultValue="account" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto flex-wrap gap-2">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="webhooks" className="flex items-center gap-2">
                  <Webhook className="h-4 w-4" />
                  Webhooks
                </TabsTrigger>
                <TabsTrigger value="llm" className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  LLM
                </TabsTrigger>
                <TabsTrigger value="storage" className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Storage
                </TabsTrigger>
                <TabsTrigger value="retention" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Retention
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Email and display name.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1"
                        aria-label="Email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Display name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="mt-1"
                        aria-label="Display name"
                      />
                    </div>
                    <Button onClick={handleSaveAccount} disabled={saving}>
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email preferences</CardTitle>
                    <CardDescription>
                      Choose which emails you receive from ConverseForms.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <Label htmlFor="email-notifications">Session and delivery notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Alerts for completed sessions and webhook delivery failures.
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        aria-label="Session and delivery notifications"
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <Label htmlFor="marketing-emails">Product and marketing emails</Label>
                        <p className="text-xs text-muted-foreground">
                          Tips, product updates, and offers.
                        </p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                        aria-label="Product and marketing emails"
                      />
                    </div>
                    <Button onClick={handleSaveEmail} disabled={saving}>
                      {saving ? 'Saving…' : 'Save preferences'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="webhooks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Webhook defaults</CardTitle>
                    <CardDescription>
                      Default retry and signing behavior for new webhooks. Configure individual
                      webhooks in the Webhooks page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-retries">Default max retries for new webhooks</Label>
                      <Input
                        id="default-retries"
                        type="number"
                        min={0}
                        max={100}
                        value={defaultRetries}
                        onChange={(e) => setDefaultRetries(parseInt(e.target.value, 10) || 0)}
                        aria-label="Default max retries"
                      />
                    </div>
                    <Button onClick={handleSaveWebhookDefaults} disabled={saving}>
                      {saving ? 'Saving…' : 'Save defaults'}
                    </Button>
                    <div className="pt-4 border-t border-border">
                      <Button variant="outline" asChild>
                        <Link to="/dashboard/webhooks">Manage webhooks</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="llm" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>LLM model defaults</CardTitle>
                    <CardDescription>
                      Default model for new agents. Can be overridden per agent.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="llm-model">Model</Label>
                      <select
                        id="llm-model"
                        value={llmModel}
                        onChange={(e) => setLlmModel(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="LLM model"
                      >
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      </select>
                    </div>
                    <Button onClick={handleSaveLLM} disabled={saving}>
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="storage" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage</CardTitle>
                    <CardDescription>
                      File and asset storage for agent context and uploads.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Storage is managed per organization. Contact support to increase limits or
                      configure custom buckets.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="retention" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data retention policy</CardTitle>
                    <CardDescription>
                      How long session data and delivery logs are kept. Shorter retention reduces
                      storage and may affect analytics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="retention-days">Retention (days)</Label>
                      <Input
                        id="retention-days"
                        type="number"
                        min={7}
                        max={3650}
                        value={retentionDays}
                        onChange={(e) => setRetentionDays(parseInt(e.target.value, 10) || 90)}
                        aria-label="Retention in days"
                      />
                      <p className="text-xs text-muted-foreground">
                        Sessions and logs older than this will be deleted. Export data before
                        retention runs if needed.
                      </p>
                    </div>
                    <Button onClick={handleSaveRetention} disabled={saving}>
                      {saving ? 'Saving…' : 'Save policy'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}
