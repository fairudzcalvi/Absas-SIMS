import { useState } from 'react';
import { createPortalUser, generateDefaultPassword } from '../utils/authProvisioning';

function IcoKey() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-1.5 1.5L14 9l-1.5-1.5-1.5 1.5 1.5 1.5-3 3a5.5 5.5 0 1 1-2-2l3-3 1.5 1.5 1.5-1.5L12 7l3.5-3.5z"/>
    </svg>
  );
}
function IcoClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IcoCopy() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CreateLoginModal({ target, onClose, onSuccess }) {
  if (!target) return null;
  const targetKey = `${target.type || ''}-${target.id || ''}-${target.email || ''}`;
  return <CreateLoginModalInner key={targetKey} target={target} onClose={onClose} onSuccess={onSuccess} />;
}

function CreateLoginModalInner({ target, onClose, onSuccess }) {
  const [password, setPassword]     = useState(() => generateDefaultPassword(target?.type === 'student' ? 'Student' : 'Faculty'));
  const [showPassword, setShowPass] = useState(true);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [successInfo, setSuccessInfo] = useState(null);
  const [copied, setCopied]         = useState(false);

  const email = target.email || '';
  const name = target.name || 'User';
  const roleLabel = target.type === 'student' ? 'Student' : 'Faculty / Teacher';

  async function handleCreate(e) {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await createPortalUser({
        email,
        password,
        fullName: name,
        role: target.role || (target.type === 'student' ? 'student' : 'teacher'),
      });

      setSuccessInfo({
        email: res.email,
        password: res.password,
      });

      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to create login account.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyCredentials() {
    if (!successInfo || !navigator.clipboard?.writeText) return;
    const text = `ABSAS SIMS Portal Login Details:\nPortal: ${window.location.origin}\nEmail: ${successInfo.email}\nTemporary Password: ${successInfo.password}\nRole: ${roleLabel}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      setError('Could not copy automatically. Please copy the credentials manually.');
    });
  }

  return (
    <div className="modal active" onClick={e => { if (e.target === e.currentTarget && !loading) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B0000' }}>
            <IcoKey /> Create Portal Login Account
          </h3>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <IcoClose />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px', fontSize: '14px', lineHeight: '1.6' }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '12px 14px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '13px',
              lineHeight: '1.5',
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {successInfo ? (
            /* Success State */
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '16px',
              color: '#166534',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '15px', marginBottom: '10px' }}>
                <IcoCheck /> Login Account Created Successfully!
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px' }}>
                Credentials for <strong>{name}</strong> have been created in the authentication system. The user can now log in to the portal.
              </p>

              <div style={{
                background: '#ffffff',
                border: '1px solid #dcfce7',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '13px',
                marginBottom: '14px',
              }}>
                <div style={{ marginBottom: '4px' }}>
                  <span style={{ color: '#666' }}>Login Email:</span> <strong>{successInfo.email}</strong>
                </div>
                <div>
                  <span style={{ color: '#666' }}>Temporary Password:</span>{' '}
                  <strong style={{ fontFamily: 'monospace', color: '#8B0000' }}>{successInfo.password}</strong>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleCopyCredentials}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                {copied ? <><IcoCheck /> Copied to Clipboard!</> : <><IcoCopy /> Copy Login Details</>}
              </button>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleCreate}>
              <p style={{ margin: '0 0 16px 0', color: '#475569' }}>
                Create login access for <strong>{name}</strong> ({roleLabel}). The admin account will remain active.
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '13px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Account Name:</span>
                  <span style={{ fontWeight: '600' }}>{name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Target Email:</span>
                  <span style={{ fontWeight: '600', color: email ? '#1e293b' : '#dc2626' }}>
                    {email || 'No email on record (Required)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Portal Role:</span>
                  <span style={{ fontWeight: '600', color: '#8B0000' }}>{roleLabel}</span>
                </div>
              </div>

              {!email && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fef3c7',
                  color: '#92400e',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginBottom: '14px',
                }}>
                  Please edit this profile and provide a valid email address before creating a portal login.
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ margin: 0 }}>Temporary Password *</label>
                  <button
                    type="button"
                    onClick={() => setPassword(generateDefaultPassword(target.type === 'student' ? 'Student' : 'Faculty'))}
                    style={{ background: 'none', border: 'none', color: '#8B0000', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Generate New
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    required
                    style={{ flex: 1, fontFamily: showPassword ? 'monospace' : 'inherit' }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowPass(p => !p)}
                    style={{ padding: '0 12px' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '12px 0 0 0', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !email}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <IcoKey /> {loading ? 'Creating Account...' : 'Create Login'}
                </button>
              </div>
            </form>
          )}
        </div>

        {successInfo && (
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
