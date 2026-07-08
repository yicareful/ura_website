"use client";

import { useActionState } from "react";
import { updateEvent, type EventFormState } from "../../actions";

const initialState: EventFormState = {};

type EventForEdit = {
  id: string;
  title: string;
  description: string;
  city: string;
  location: string;
  registrationStart: Date;
  registrationEnd: Date;
  eventDate: Date;
  status: string;
};

function toDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditEventForm({ event }: { event: EventForEdit }) {
  const boundAction = updateEvent.bind(null, event.id);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction}>
      <div className="card notch" style={{ padding: "var(--space-6)", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-5)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", color: "var(--color-text-secondary)" }}>赛事信息</h2>
        <div className="form-group">
          <label className="form-label" htmlFor="title">赛事名称</label>
          <input className="form-input" id="title" name="title" defaultValue={event.title} required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">赛事简介</label>
          <textarea className="form-textarea" id="description" name="description" rows={3} defaultValue={event.description} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="city">城市</label>
            <input className="form-input" id="city" name="city" defaultValue={event.city} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="location">地点</label>
            <input className="form-input" id="location" name="location" defaultValue={event.location} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="registrationStart">报名开始时间</label>
            <input className="form-input" id="registrationStart" name="registrationStart" type="datetime-local" defaultValue={toDatetimeLocal(event.registrationStart)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="registrationEnd">报名截止时间</label>
            <input className="form-input" id="registrationEnd" name="registrationEnd" type="datetime-local" defaultValue={toDatetimeLocal(event.registrationEnd)} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="eventDate">赛事日期</label>
            <input className="form-input" id="eventDate" name="eventDate" type="datetime-local" defaultValue={toDatetimeLocal(event.eventDate)} required />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">状态</label>
            <select className="form-select" id="status" name="status" defaultValue={event.status}>
              <option value="draft">待发布</option>
              <option value="open">报名中</option>
              <option value="closed">报名截止</option>
              <option value="finished">已结束</option>
            </select>
          </div>
        </div>
      </div>

      {state.error && <p className="form-error" style={{ marginBottom: "var(--space-4)", padding: "var(--space-3) var(--space-4)", background: "rgba(225,29,46,0.08)", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--color-red)" }}>{state.error}</p>}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "保存中..." : "保存修改"}
      </button>
    </form>
  );
}