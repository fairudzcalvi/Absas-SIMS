import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function IcoCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IcoChevronDown() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
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

export default function SchoolYearSelector({ compact = false }) {
  const {
    schoolYears,
    selectedSchoolYear,
    setSelectedSchoolYear,
    selectedQuarter,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const currentLabel = selectedSchoolYear?.year_label ? `S.Y. ${selectedSchoolYear.year_label}` : 'S.Y. 2025-2026';
  const isActiveYear = selectedSchoolYear?.is_active ?? true;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: compact ? '4px 8px' : '6px 10px',
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '6px',
          color: '#fff',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: compact ? '11px' : '12px',
          transition: 'all 0.15s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        }}
        title="Click to switch academic school year"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isActiveYear ? '#4ade80' : '#f59e0b',
              flexShrink: 0,
            }}
          />
          <span style={{ fontWeight: '600', color: '#FFD700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentLabel}
          </span>
          {selectedQuarter && (
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.75)', whiteSpace: 'nowrap' }}>
              • {selectedQuarter.quarter_name}
            </span>
          )}
        </div>
        <span style={{ color: 'rgba(255, 255, 255, 0.7)', flexShrink: 0 }}>
          <IcoChevronDown />
        </span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            padding: '4px',
            minWidth: '220px',
          }}
        >
          <div style={{ padding: '6px 10px', borderBottom: '1px solid #f1f3f5', fontSize: '11px', fontWeight: '700', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Select Academic Year
          </div>

          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {schoolYears.length === 0 ? (
              <div style={{ padding: '10px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                No school years configured
              </div>
            ) : (
              schoolYears.map(sy => {
                const isSelected = selectedSchoolYear?.id === sy.id || (!selectedSchoolYear && sy.is_active);
                return (
                  <button
                    key={sy.id}
                    type="button"
                    onClick={() => {
                      setSelectedSchoolYear(sy);
                      setOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: isSelected ? '#f8f9fa' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '13px',
                      color: isSelected ? '#8B0000' : '#333',
                      fontWeight: isSelected ? '700' : '500',
                      transition: 'background 0.12s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = isSelected ? '#f1f3f5' : '#f8f9fa'; }}
                    onMouseOut={e => { e.currentTarget.style.background = isSelected ? '#f8f9fa' : 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: sy.is_active ? '#22c55e' : '#f59e0b',
                        }}
                      />
                      <span>S.Y. {sy.year_label}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          background: sy.is_active ? '#dcfce7' : '#fef3c7',
                          color: sy.is_active ? '#15803d' : '#b45309',
                        }}
                      >
                        {sy.is_active ? 'Active' : 'Archived'}
                      </span>
                    </div>

                    {isSelected && (
                      <span style={{ color: '#8B0000' }}>
                        <IcoCheck />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
