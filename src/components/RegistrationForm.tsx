"use client";

import { useActionState } from "react";
import { submitRegistration, type RegisterFormState } from "@/app/events/[id]/register/actions";
import { GENDER_LABEL } from "@/lib/constants";
import { formatAgeRange, formatFee } from "@/lib/format";

type GroupOption = {
  id: string;
  name: string;
  gender: string;
  minAge: number | null;
  maxAge: number | null;
  fee: number;
  remaining: number;
  scheduleName: string;
};

type RunnerInfo = {
  id: string;
  name: string;
  gender: string;
  idCard: string;
  phone: string;
  email: string | null;
  school: string;
  major: string | null;
};

export function RegistrationForm({
  eventId,
  groups,
  defaultGroupId,
  runner,
}: {
  eventId: string;
  groups: GroupOption[];
  defaultGroupId?: string;
  runner: RunnerInfo;
}) {
  const initialState: RegisterFormState = {};
  const boundAction = submitRegistration.bind(null, eventId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction}>
      {state?.error && (
        <div
          className="form-error"
          style={{
            marginBottom: "var(--space-5)",
            padding: "var(--space-3) var(--space-4)",
            background: "rgba(239,68,68,0.08)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {state.error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="groupId">
          报名组别 *
        </label>
        <select
          id="groupId"
          name="groupId"
          className="form-select"
          defaultValue={defaultGroupId}
          required
        >
          <option value="">请选择组别</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id} disabled={g.remaining <= 0}>
              {g.scheduleName} · {g.name}（{GENDER_LABEL[g.gender] ?? g.gender}，
              {formatAgeRange(g.minAge, g.maxAge)}，{formatFee(g.fee)}）
              {g.remaining <= 0 ? " — 已满" : ` — 剩余${g.remaining}`}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            姓名 *
          </label>
          <input className="form-input" id="name" name="name" defaultValue={runner.name} readOnly style={{ background: "var(--color-light-base)", color: "var(--color-text-muted)" }} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="gender">
            性别 *
          </label>
          <select className="form-select" id="gender" name="gender" defaultValue={runner.gender} disabled style={{ background: "var(--color-light-base)", color: "var(--color-text-muted)" }}>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="idCard">
            身份证号 *
          </label>
          <input className="form-input" id="idCard" name="idCard" defaultValue={runner.idCard} readOnly maxLength={18} style={{ background: "var(--color-light-base)", color: "var(--color-text-muted)" }} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            手机号 *
          </label>
          <input className="form-input" id="phone" name="phone" defaultValue={runner.phone} readOnly maxLength={11} style={{ background: "var(--color-light-base)", color: "var(--color-text-muted)" }} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="email">
          邮箱
        </label>
        <input className="form-input" id="email" name="email" type="email" defaultValue={runner.email ?? ""} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="school">
            学校 *
          </label>
          <input className="form-input" id="school" name="school" defaultValue={runner.school} readOnly style={{ background: "var(--color-light-base)", color: "var(--color-text-muted)" }} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="major">
            院系/专业
          </label>
          <input className="form-input" id="major" name="major" defaultValue={runner.major ?? ""} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="emergencyContact">
            紧急联系人 *
          </label>
          <input className="form-input" id="emergencyContact" name="emergencyContact" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="emergencyPhone">
            紧急联系人电话 *
          </label>
          <input className="form-input" id="emergencyPhone" name="emergencyPhone" required maxLength={11} />
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={pending} style={{ marginTop: "var(--space-4)" }}>
        {pending ? "提交中…" : "提交报名"}
      </button>
    </form>
  );
}