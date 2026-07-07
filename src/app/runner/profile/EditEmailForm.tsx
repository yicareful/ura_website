"use client";

import { useActionState } from "react";
import {
  updateEmailAction,
  type UpdateEmailState,
} from "./actions";

const initialState: UpdateEmailState = {};

export function EditEmailForm() {
  const [state, formAction, pending] = useActionState(
    updateEmailAction,
    initialState
  );

  return (
    <form action={formAction}>
      {state.success && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-success)",
            marginBottom: "var(--space-4)",
            padding: "var(--space-3) var(--space-4)",
            background: "rgba(34,197,94,0.08)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          {state.success}
        </p>
      )}
      {state.error && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-error)",
            marginBottom: "var(--space-4)",
            padding: "var(--space-3) var(--space-4)",
            background: "rgba(239,68,68,0.08)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {state.error}
        </p>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="edit-email">
          新邮箱
        </label>
        <input
          className="form-input"
          id="edit-email"
          name="email"
          type="email"
          required
          placeholder="请输入新的邮箱地址"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="edit-email-password">
          当前密码
        </label>
        <input
          className="form-input"
          id="edit-email-password"
          name="password"
          type="password"
          required
          placeholder="请输入当前密码以确认修改"
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ width: "100%" }}
        disabled={pending}
      >
        {pending ? "保存中…" : "更新邮箱"}
      </button>
    </form>
  );
}
