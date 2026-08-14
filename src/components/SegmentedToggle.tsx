import './SegmentedToggle.css'

interface Option<T extends string> {
  value: T
  label: string
}

interface SegmentedToggleProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}

export function SegmentedToggle<T extends string>({ options, value, onChange, ariaLabel }: SegmentedToggleProps<T>) {
  return (
    <div className="segmented-toggle" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={opt.value === value ? 'is-active' : ''}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
