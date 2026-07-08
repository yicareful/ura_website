"use client";

import { useActionState, useState } from "react";
import { createEvent, type EventFormState } from "../actions";

const initialState: EventFormState = {};

const hourOptions = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minuteOptions = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

type GroupDraft = {
  name: string;
  distance: string;
  startTime: string;
  cutoffTime: string;
  gender: string;
  minAge: string;
  maxAge: string;
  capacity: string;
  fee: string;
};

function emptyGroup(): GroupDraft {
  return {
    name: "",
    distance: "",
    startTime: "08:00",
    cutoffTime: "12:00",
    gender: "all",
    minAge: "",
    maxAge: "",
    capacity: "500",
    fee: "80",
  };
}

function TimePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hour = "08", minute = "00"] = value.split(":");

  function setTime(nextHour: string, nextMinute: string) {
    onChange(`${nextHour}:${nextMinute}`);
  }

  return (
    <div className="form-group" style={{ position: "relative" }}>
      <label className="form-label">{label}</label>
      <button
        type="button"
        className="form-input"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        style={{
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--color-surface)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span>{value}</span>
        <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-xs)" }}>选择</span>
      </button>

      {open && (
        <div
          className="card"
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + var(--space-2))",
            left: 0,
            right: 0,
            padding: "var(--space-4)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div>
              <div className="form-label">小时</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-1)" }}>
                {hourOptions.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setTime(h, minute)}
                    className={h === hour ? "btn-primary" : "btn-secondary"}
                    style={{ padding: "var(--space-1) 0", borderRadius: "var(--radius-sm)", fontSize: "var(--text-sm)", minHeight: 32 }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="form-label">分钟</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-1)" }}>
                {minuteOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTime(hour, m)}
                    className={m === minute ? "btn-primary" : "btn-secondary"}
                    style={{ padding: "var(--space-1) 0", borderRadius: "var(--radius-sm)", fontSize: "var(--text-sm)", minHeight: 32 }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--space-4)" }}>
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EventForm() {
  const [state, formAction, pending] = useActionState(createEvent, initialState);
  const [groups, setGroups] = useState<GroupDraft[]>([emptyGroup()]);

  function updateGroup(index: number, patch: Partial<GroupDraft>) {
    setGroups((prev) => prev.map((group, i) => (i === index ? { ...group, ...patch } : group)));
  }

  function addGroup() {
    setGroups((prev) => [...prev, emptyGroup()]);
  }

  function removeGroup(index: number) {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  }

  function buildGroupsJson() {
    return JSON.stringify(
      groups.map((group) => ({
        name: group.name,
        distance: Number(group.distance),
        startTime: group.startTime,
        cutoffTime: group.cutoffTime,
        gender: group.gender,
        minAge: group.minAge ? Number(group.minAge) : null,
        maxAge: group.maxAge ? Number(group.maxAge) : null,
        capacity: Number(group.capacity),
        fee: Math.round(Number(group.fee) * 100),
      }))
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="groupsJson" value={buildGroupsJson()} />

      <div className="card notch" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-5)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--color-text-secondary)" }}>赛事信息</h2>
        <div className="form-group">
          <label className="form-label" htmlFor="title">赛事名称</label>
          <input className="form-input" id="title" name="title" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">赛事简介</label>
          <textarea className="form-textarea" id="description" name="description" rows={3} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="city">城市</label>
            <input className="form-input" id="city" name="city" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="location">地点</label>
            <input className="form-input" id="location" name="location" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="registrationStart">报名开始时间</label>
            <input className="form-input" id="registrationStart" name="registrationStart" type="datetime-local" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="registrationEnd">报名截止时间</label>
            <input className="form-input" id="registrationEnd" name="registrationEnd" type="datetime-local" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="eventDate">赛事日期</label>
            <input className="form-input" id="eventDate" name="eventDate" type="datetime-local" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">状态</label>
            <select className="form-select" id="status" name="status" defaultValue="draft">
              <option value="draft">待发布</option>
              <option value="open">报名中</option>
              <option value="closed">报名截止</option>
              <option value="finished">已结束</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card notch" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-5)" }}>
          <h2 style={{ fontSize: "var(--text-lg)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--color-text-secondary)" }}>报名组别</h2>
          <button type="button" className="btn-secondary" onClick={addGroup}>+ 添加组别</button>
        </div>

        {groups.map((group, index) => (
          <div
            key={index}
            style={{
              border: "1px solid var(--color-border)",
              borderLeft: "4px solid var(--color-red)",
              borderRadius: "var(--radius-sm)",
              padding: "var(--space-4)",
              marginBottom: "var(--space-4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
              <h3 style={{ fontSize: "var(--text-base)", fontFamily: "var(--font-display)", fontWeight: 700 }}>组别 {index + 1}</h3>
              {groups.length > 1 && (
                <button type="button" className="btn-secondary" onClick={() => removeGroup(index)}>删除组别</button>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">组别名称</label>
                <input className="form-input" value={group.name} onChange={(e) => updateGroup(index, { name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">距离（公里）</label>
                <input className="form-input" type="number" step="0.1" min="0" value={group.distance} onChange={(e) => updateGroup(index, { distance: e.target.value })} required />
              </div>
            </div>

            <div className="form-row">
              <TimePicker label="起跑时间" value={group.startTime} onChange={(value) => updateGroup(index, { startTime: value })} />
              <TimePicker label="关门时间" value={group.cutoffTime} onChange={(value) => updateGroup(index, { cutoffTime: value })} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">性别限制</label>
                <select className="form-select" value={group.gender} onChange={(e) => updateGroup(index, { gender: e.target.value })}>
                  <option value="all">不限</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">名额</label>
                <input className="form-input" type="number" min="1" value={group.capacity} onChange={(e) => updateGroup(index, { capacity: e.target.value })} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">最小年龄（可空）</label>
                <input className="form-input" type="number" min="0" value={group.minAge} onChange={(e) => updateGroup(index, { minAge: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">最大年龄（可空）</label>
                <input className="form-input" type="number" min="0" value={group.maxAge} onChange={(e) => updateGroup(index, { maxAge: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">报名费（元）</label>
              <input className="form-input" type="number" min="0" value={group.fee} onChange={(e) => updateGroup(index, { fee: e.target.value })} required />
            </div>
          </div>
        ))}
      </div>

      {state.error && <p className="form-error" style={{ marginBottom: "var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "rgba(225,29,46,0.08)", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--color-red)" }}>{state.error}</p>}

      <div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "创建中..." : "创建赛事"}
        </button>
      </div>
    </form>
  );
}