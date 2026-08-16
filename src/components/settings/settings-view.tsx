"use client";

import { Button, Card, FieldLabel, Input, PageHeader, Select } from "@/components/ui";
import { useApp } from "@/context/app-context";
import { roleLabel } from "@/lib/format";
import { useState } from "react";

export function SettingsView() {
  const { me, role, setRole } = useApp();
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        kicker="Workspace"
        title="Settings"
        subtitle="Preferences stay local until a backend is connected."
      />
      <div className="space-y-4">
        <Card>
          <h2 className="mb-4 text-[13px] font-semibold tracking-tight">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Name</FieldLabel>
              <Input defaultValue={me.name} />
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <Input defaultValue={me.email} />
            </div>
            <div>
              <FieldLabel>Title</FieldLabel>
              <Input defaultValue={me.title} />
            </div>
            <div>
              <FieldLabel>Timezone</FieldLabel>
              <Input defaultValue={me.timezone} />
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-[13px] font-semibold tracking-tight">Role preview</h2>
          <p className="mb-3 text-sm text-slate-500">
            Switch the working view to inspect investor, client, candidate, and company dashboards.
          </p>
          <Select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            {(Object.keys(roleLabel) as Array<typeof role>).map((r) => (
              <option key={r} value={r}>
                {roleLabel[r]}
              </option>
            ))}
          </Select>
        </Card>
        <Card>
          <h2 className="mb-4 text-[13px] font-semibold tracking-tight">Meeting defaults</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Default recording</FieldLabel>
              <Select defaultValue="prompt">
                <option value="off">Off</option>
                <option value="prompt">Prompt host</option>
                <option value="on">On (simulated)</option>
              </Select>
            </div>
            <div>
              <FieldLabel>Layout</FieldLabel>
              <Select defaultValue="gallery">
                <option value="gallery">Gallery</option>
                <option value="speaker">Speaker</option>
              </Select>
            </div>
          </div>
          <Button
            className="mt-5"
            onClick={() => {
              setSaved(true);
              window.setTimeout(() => setSaved(false), 1400);
            }}
          >
            {saved ? "Saved" : "Save changes"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
