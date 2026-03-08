import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { AnimatedPage } from '@/components/AnimatedPage'
import {
  FieldList,
  PersonaEditor,
  AppearanceEditor,
  AttachmentsPanel,
  InlineTips,
  LiveChatPreview,
} from '@/components/agent-builder'
import type { BuilderTab } from '@/components/agent-builder'
import { useAgent, useUpdateAgent, useCreateAgent } from '@/hooks/useAgents'
import type { FormField, Persona, Appearance } from '@/types/agent'
import { ArrowLeft, Settings2, MessageSquare, Palette, FileText, Loader2 } from 'lucide-react'

const defaultPersona: Persona = { tone: '', instructions: '' }
const defaultAppearance: Appearance = {}

export default function AgentBuilder() {
  const { id } = useParams()
  const isNew = id === 'new'

  const { data: agent, isLoading: agentLoading } = useAgent(isNew ? undefined : id ?? undefined)
  const updateAgent = useUpdateAgent()
  const createAgent = useCreateAgent()

  const initialFields = useMemo<FormField[]>(() => {
    const list = agent?.fields
    return Array.isArray(list) ? list : []
  }, [agent?.fields])

  const initialPersona = useMemo<Persona>(() => {
    const p = agent?.persona
    return p ? { ...defaultPersona, ...p } : defaultPersona
  }, [agent?.persona])

  const initialAppearance = useMemo<Appearance>(() => {
    const a = agent?.appearance
    return a ? { ...defaultAppearance, ...a } : defaultAppearance
  }, [agent?.appearance])

  const [name, setName] = useState(agent?.name ?? '')
  const [description, setDescription] = useState(agent?.description ?? '')
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [persona, setPersona] = useState<Persona>(initialPersona)
  const [appearance, setAppearance] = useState<Appearance>(initialAppearance)
  const [activeTab, setActiveTab] = useState<BuilderTab>('fields')

  useEffect(() => {
    setName(agent?.name ?? '')
    setDescription(agent?.description ?? '')
    setFields(initialFields)
    setPersona(initialPersona)
    setAppearance(initialAppearance)
  }, [agent?.name, agent?.description, initialFields, initialPersona, initialAppearance])

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const formStateRef = useRef({ id, name, description, fields, persona, appearance, updateAgent })
  formStateRef.current = { id, name, description, fields, persona, appearance, updateAgent }
  const autoSave = useCallback(() => {
    if (isNew || !id) return
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      const s = formStateRef.current
      if (!s.id) return
      s.updateAgent.mutate({
        id: s.id,
        data: {
          name: s.name.trim() || undefined,
          description: s.description.trim() || undefined,
          fields: s.fields,
          persona: s.persona,
          appearance: s.appearance,
        },
      })
      autoSaveTimerRef.current = null
    }, 2000)
  }, [id, name, description, fields, persona, appearance, isNew])

  useEffect(() => {
    if (isNew || !id) return
    autoSave()
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    }
  }, [autoSave, id, isNew])

  const handleSave = () => {
    if (isNew) {
      createAgent.mutate(
        {
          name: name.trim() || 'Untitled Agent',
          description: description.trim() || undefined,
          fields,
          persona,
          appearance,
        },
        {
          onSuccess: (created) => {
            if (created?.id) {
              window.location.href = `/dashboard/agents/${created.id}`
            }
          },
        }
      )
    } else if (id) {
      updateAgent.mutate(
        {
          id,
          data: {
            name: name.trim() || undefined,
            description: description.trim() || undefined,
            fields,
            persona,
            appearance,
          },
        }
      )
    }
  }

  const saving = updateAgent.isPending || createAgent.isPending
  const disabled = saving || agentLoading

  return (
    <AnimatedPage>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="border-b border-border px-8 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/agents" aria-label="Back to agents">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold text-foreground">
                  {isNew ? 'New agent' : 'Edit agent'}
                </h1>
                <p className="text-muted-foreground">
                  Configure fields, persona, appearance, and context.
                </p>
              </div>
            </div>
          </div>
          <div className="p-8 max-w-[1200px]">
            <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
              <div className="min-w-0">
                {agentLoading && !agent ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
                ) : (
                  <>
                    <div className="mb-6">
                  <InlineTips activeTab={activeTab} className="mb-4" />
                </div>
                <div className="mb-6 space-y-4">
                  <div>
                    <Label htmlFor="agent-name">Agent name</Label>
                    <Input
                      id="agent-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My Agent"
                      disabled={disabled}
                      className="mt-1 max-w-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="agent-description">Description (optional)</Label>
                    <Input
                      id="agent-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description"
                      disabled={disabled}
                      className="mt-1 max-w-md"
                    />
                  </div>
                </div>

                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as BuilderTab)}
                  className="w-full"
                >
                  <TabsList className="mb-6">
                    <TabsTrigger value="fields" className="gap-2">
                      <Settings2 className="h-4 w-4" />
                      Fields
                    </TabsTrigger>
                    <TabsTrigger value="persona" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Persona
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                      <Palette className="h-4 w-4" />
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger value="context" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Context
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="fields">
                    <FieldList
                      fields={fields}
                      onChange={setFields}
                      disabled={disabled}
                    />
                  </TabsContent>
                  <TabsContent value="persona">
                    <PersonaEditor
                      persona={persona}
                      onChange={setPersona}
                      disabled={disabled}
                    />
                  </TabsContent>
                  <TabsContent value="appearance">
                    <AppearanceEditor
                      appearance={appearance}
                      onChange={setAppearance}
                      disabled={disabled}
                    />
                  </TabsContent>
                  <TabsContent value="context">
                    <AttachmentsPanel
                      agentId={isNew ? undefined : id ?? undefined}
                      disabled={disabled}
                    />
                  </TabsContent>
                </Tabs>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={saving || !name.trim()}
                    className="transition-all hover:scale-[1.02]"
                    aria-label="Save draft"
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Save draft
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={isNew ? '/dashboard/agents' : `/dashboard/agents/${id ?? ''}/publish`}>
                      {isNew ? 'Cancel' : 'Publish'}
                    </Link>
                  </Button>
                    </div>
                  </>
                )}
              </div>
              <div className="hidden lg:block shrink-0">
                <div className="sticky top-8">
                  <LiveChatPreview
                    agentName={name}
                    fields={fields}
                    persona={persona}
                    appearance={appearance}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  )
}

