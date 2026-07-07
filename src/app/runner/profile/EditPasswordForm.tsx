"use client";

import { useActionState } from "react";
import {
  updatePasswordAction,
  type UpdatePasswordState,
} from "./actions";

const initialState: UpdatePasswordState = {};

export function EditPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
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
        <label className="form-label" htmlFor="edit-pw-current">
          当前密码
        </label>
        <input
          className="form-input"
          id="edit-pw-current"
          name="currentPassword"
          type="password"
          required
          placeholder="请输入当前密码"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="edit-pw-new">
          新密码
        </label>
        <input
          className="form-input"
          id="edit-pw-new"
          name="newPassword"
          type="password"
          required
          minLength={6}
          placeholder="请输入新密码（至少6位）"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="edit-pw-confirm">
          确认新密码
        </label>
        <input
          className="form-input"
          id="edit-pw-confirm"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          placeholder="请再次输入新密码"
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        style={{ width: "100%" }}
        disabled={pending}
      >
        {pending ? "保存中…" : "更新密码"}
      </button>
    </form>
  );
}
