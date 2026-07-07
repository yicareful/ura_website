"use client";

import { useActionState, useState } from "react";
import { createEvent, type EventFormState } from "../actions";

const initialState: EventFormState = {};

type GroupDraft = {
  name: string;
  gender: string;
  minAge: string;
  maxAge: string;
  capacity: string;
  fee: string;
};

type ScheduleDraft = {
  name: string;
  distance: string;
  startTime: string;
  cutoffTime: string;
  capacity: string;
  groups: GroupDraft[];
};

function emptyGroup(): GroupDraft {
  return { name: "", gender: "all", minAge: "", maxAge: "", capacity: "100", fee: "80" };
}

function emptySchedule(): ScheduleDraft {
  return {
    name: "",
    distance: "",
    startTime: "08:00",
    cutoffTime: "12:00",
    capacity: "500",
    groups: [emptyGroup()],
  };
}

export function EventForm() {
  const [state, formAction, pending] = useActionState(createEvent, initialState);
  const [schedules, setSchedules] = useState<ScheduleDraft[]>([emptySchedule()]);

  function updateSchedule(index: number, patch: Partial<ScheduleDraft>) {
    setSchedules((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function updateGroup(scheduleIndex: number, groupIndex: number, patch: Partial<GroupDraft>) {
    setSchedules((prev) =>
      prev.map((s, i) =>
        i === scheduleIndex
          ? { ...s, groups: s.groups.map((g, gi) => (gi === groupIndex ? { ...g, ...patch } : g)) }
          : s
      )
    );
  }

  function addSchedule() {
    setSchedules((prev) => [...prev, emptySchedule()]);
  }

  function removeSchedule(index: number) {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  }

  function addGroup(scheduleIndex: number) {
    setSchedules((prev) =>
      prev.map((s, i) => (i === scheduleIndex ? { ...s, groups: [...s.groups, emptyGroup()] } : s))
    );
  }

  function removeGroup(scheduleIndex: number, groupIndex: number) {
    setSchedules((prev) =>
      prev.map((s, i) =>
        i === scheduleIndex ? { ...s, groups: s.groups.filter((_, gi) => gi !== groupIndex) } : s
      )
    );
  }

  function buildSchedulesJson() {
    return JSON.stringify(
      schedules.map((s) => ({
        name: s.name,
        distance: Number(s.distance),
        startTime: s.startTime,
        cutoffTime: s.cutoffTime,
        capacity: Number(s.capacity),
        groups: s.groups.map((g) => ({
          name: g.name,
          gender: g.gender,
          minAge: g.minAge ? Number(g.minAge) : null,
          maxAge: g.maxAge ? Number(g.maxAge) : null,
          capacity: Number(g.capacity),
          fee: Math.round(Number(g.fee) * 100),
        })),
      }))
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="schedulesJson" value={buildSchedulesJson()} />

      <div className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)" }}>基本信息</h2>

        <div className="form-group">
          <label className="form-label" htmlFor="title">
            赛事名称
          </label>
          <input className="form-input" id="title" name="title" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            赛事简介
          </label>
          <textarea className="form-textarea" id="description" name="description" rows={3} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="city">
              城市
            </label>
            <input className="form-input" id="city" name="city" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              地点
            </label>
            <input className="form-input" id="location" name="location" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="registrationStart">
              报名开始时间
            </label>
            <input className="form-input" id="registrationStart" name="registrationStart" type="datetime-local" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="registrationEnd">
              报名截止时间
            </label>
            <input className="form-input" id="registrationEnd" name="registrationEnd" type="datetime-local" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="eventDate">
              赛事日期
            </label>
            <input className="form-input" id="eventDate" name="eventDate" type="datetime-local" required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">
              状态
            </label>
            <select className="form-select" id="status" name="status" defaultValue="draft">
              <option value="draft">待发布</option>
              <option value="open">报名中</option>
              <option value="closed">报名截止</option>
              <option value="finished">已结束</option>
            </select>
          </div>
        </div>
      </div>

      {schedules.map((schedule, si) => (
        <div key={si} className="card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
            <h2 style={{ fontSize: "var(--text-lg)" }}>赛程 {si + 1}</h2>
            {schedules.length > 1 && (
              <button type="button" className="btn-secondary" onClick={() => removeSchedule(si)}>
                删除赛程
              </button>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">赛程名称</label>
              <input
                className="form-input"
                value={schedule.name}
                onChange={(e) => updateSchedule(si, { name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">距离（公里）</label>
              <input
                className="form-input"
                type="number"
                step="0.1"
                value={schedule.distance}
                onChange={(e) => updateSchedule(si, { distance: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">起跑时间</label>
              <input
                className="form-input"
                value={schedule.startTime}
                onChange={(e) => updateSchedule(si, { startTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">关门时间</label>
              <input
                className="form-input"
                value={schedule.cutoffTime}
                onChange={(e) => updateSchedule(si, { cutoffTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">赛程名额</label>
            <input
              className="form-input"
              type="number"
              value={schedule.capacity}
              onChange={(e) => updateSchedule(si, { capacity: e.target.value })}
              required
            />
          </div>

          <h3 style={{ fontSize: "var(--text-base)", margin: "var(--space-5) 0 var(--space-3)" }}>组别</h3>

          {schedule.groups.map((group, gi) => (
            <div
              key={gi}
              style={{
                border: "1px solid var(--color-light-border)",
                borderRadius: "var(--radius-sm)",
                padding: "var(--space-4)",
                marginBottom: "var(--space-3)",
              }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">组别名称</label>
                  <input
                    className="form-input"
                    value={group.name}
                    onChange={(e) => updateGroup(si, gi, { name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">性别限制</label>
                  <select
                    className="form-select"
                    value={group.gender}
                    onChange={(e) => updateGroup(si, gi, { gender: e.target.value })}
                  >
                    <option value="all">不限</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">最小年龄（可空）</label>
                  <input
                    className="form-input"
                    type="number"
                    value={group.minAge}
                    onChange={(e) => updateGroup(si, gi, { minAge: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">最大年龄（可空）</label>
                  <input
                    className="form-input"
                    type="number"
                    value={group.maxAge}
                    onChange={(e) => updateGroup(si, gi, { maxAge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">名额</label>
                  <input
                    className="form-input"
                    type="number"
                    value={group.capacity}
                    onChange={(e) => updateGroup(si, gi, { capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">报名费（元）</label>
                  <input
                    className="form-input"
                    type="number"
                    value={group.fee}
                    onChange={(e) => updateGroup(si, gi, { fee: e.target.value })}
                    required
                  />
                </div>
              </div>

              {schedule.groups.length > 1 && (
                <button type="button" className="btn-secondary" onClick={() => removeGroup(si, gi)}>
                  删除组别
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn-secondary" onClick={() => addGroup(si)}>
            + 添加组别
          </button>
        </div>
      ))}

      <button type="button" className="btn-secondary" onClick={addSchedule} style={{ marginBottom: "var(--space-6)" }}>
        + 添加赛程
      </button>

      {state.error && <p className="form-error" style={{ marginBottom: "var(--space-4)" }}>{state.error}</p>}

      <div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "创建中…" : "创建赛事"}
        </button>
      </div>
    </form>
  );
}
